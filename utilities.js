require('dotenv').config();
const { LOG_API_CALL_TIME, LOG_API_CALL_RESULT, LOG_API_CALL_ERRORS } = require('./config');
const fs  = require ("fs");
const path = require('path');
const events = require('events');
const readline = require('readline');
const { Readable } = require ("stream");
const math = require('@dip1059/safe-math-js');
// const { TEST, LOG_TIME } = process.env;

// const _ = require('lodash');

const callAPI = async (library, methodPath, ...args) => {
    

      const methodName = methodPath.split('.').pop();
      const method = library[methodName];
    
      if (typeof method !== 'function') {
        const message = `Method ${methodPath} not found`;
        throw new Error(message)
      }

      let res, start, spentTime;
     

        
        // if ( LOG_API_CALL_TIME) 
        start = measureTime();
       
        try {
            res = await method.call(library, ...args);
        } catch(error) {
            const message = `Error occured while calling ${methodPath}`;
            if (LOG_API_CALL_ERRORS) console.error(message, error);
            return {error};
        }

      spentTime  = measureTime(start)
      if (LOG_API_CALL_TIME) console.log({[methodPath]:spentTime});
      if (LOG_API_CALL_RESULT) console.log(`${methodPath} result:`, res);
      
        return res;
    }


    const measureTime = (start, format = true) => {
        if (! LOG_API_CALL_TIME) return;
        const NS_PER_SEC = 1e9;
        const NUM_IN_MS = 1000000;
        if (start) {
          const diff = process.hrtime(start);
          const time = format ? 
          ((diff[0] ? diff[0] + ' sec, ' : '') + (diff[1]/NUM_IN_MS).toFixed(3) + 'ms') :
          parseFloat((diff[0] * 1000 + (diff[1] / NUM_IN_MS).toFixed(3)));
          return time;
        }
        return process.hrtime();
    }

    

    // const formatMilliseconds = (milliseconds) => {
    //     const ms = milliseconds % 1000;
    //     milliseconds = (milliseconds - ms) / 1000;
    // }
    

    const delay = (time) => {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
    }

    const random = (min, max) => {
        return Math.round(Math.random() * (max - min) + min);
    }

    const roughSizeOfObject = (value) => {
        const typeSizes = {
          "undefined": () => 0,
          "boolean": () => 4,
          "number": () => 8,
           "bigint": () => 8,
          "string": item => 2 * item.length,
          "object": item => !item ? 0 : Object
            .keys(item)
            .reduce((total, key) => ut.roughSizeOfObject(key) + ut.roughSizeOfObject(item[key]) + total, 0)
        };
        return typeSizes[typeof value](value)
    }
    
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    const humanFileSize = (bytes, si=false, dp=1) => {
        const thresh = si ? 1000 : 1024;
      
        if (Math.abs(bytes) < thresh) {
          return bytes + ' B';
        }
      
        const units = si 
          ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
          : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10**dp;
      
        do {
          bytes /= thresh;
          ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
      
      
        return bytes.toFixed(dp) + ' ' + units[u];
    }

    const extractVideoFrames = async (videoPath, outputDir, frameRate = 1, prefix = 'frame') => {
        const ffmpeg = require('fluent-ffmpeg');
        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .outputOptions([
                    '-vf fps=' + frameRate,
                    '-q:v 15'
                    // '-update 1'
                ])
                .output(outputDir + `/${prefix}%04d.jpg`)
                .on('end', () => {
                    resolve();
                })
                .on('error', (err) => {
                    reject(err);
                })
                .run();
        });
    }

    const cleanDirectory = async (dir) => {
        try {
          const files = await fs.promises.readdir(dir);
          for (const file of files) {
            await fs.promises.unlink(path.join(dir, file));
          }
        } catch (error) {
          console.error('Error cleaning directory:', error);
        }
    }

    const processFileLineByLine = async (filePath, processLineCallback, finishCallback) => {
      let index = 0, stat;
      const startMemory = process.memoryUsage().heapUsed, startTime = measureTime();
      try {
          stat = fs.statSync(filePath);
          const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity
          });
      
          rl.on('line', (line) => {
            // console.log(`Line from file: ${line}`);
            index++;
            processLineCallback({line, index});
          });
      
          await events.once(rl, 'close');
      
          if (typeof finishCallback === 'function') {
            const size = humanFileSize(stat.size, true);
            const memoryUsed = (process.memoryUsage().heapUsed - startMemory) / 1024 / 1024;
            const MB = Math.round(memoryUsed * 100) / 100 + ' MB';
            const time = measureTime(startTime);
            
            finishCallback({filePath, size, lines:index, used: MB, time});
          }
      } catch (err) {
          console.error(err);
      }
    }

 const saveFileFromWeb = async (url, path) => {
    const res = await fetch(url);
    if (!res.ok || !res.body) return({error:`unexpected response ${res.statusText}`});
    let writer = fs.createWriteStream(path);
    Readable.fromWeb(res.body).pipe(writer);
 }

 


    



module.exports = {callAPI, measureTime, math, delay, random, roughSizeOfObject, formatBytes, 
                  humanFileSize, extractVideoFrames, cleanDirectory, processFileLineByLine, saveFileFromWeb };