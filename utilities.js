require('dotenv').config();
const LOG_TIME = process.env.LOG_TIME;

class ut {
    static logTime(label, start){
        if (!LOG_TIME) return;
        const NS_PER_SEC = 1e9;
        const NUM_IN_MS = 1000000;
        if (start) {
          const diff = process.hrtime(start);
          const time = (diff[0] ? diff[0] + ' sec, ' : '') + (diff[1]/NUM_IN_MS).toFixed(3) + 'ms';
          return console.log(label, time);
        }
        return process.hrtime();
       }

    static getRandom(min, max) {
        return Math.round(Math.random() * (max - min) + min);
      }
    
      static formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }


}


module.exports = ut;