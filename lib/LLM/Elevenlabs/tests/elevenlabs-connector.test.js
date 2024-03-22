const {
    textToSpeech,
    textToSpeechStream,
    getVoices,
    getVoice,
    editVoiceSettings,
    getVoiceSettings,
    deleteVoice,
    getModels,
    getUserInfo,
    getUserSubscription,
    getDefaultVoiceSettings
} = require('../elevenlabs-connector');


jest.setTimeout(20000);

describe('Elevenlabs Connector', () => { 


    test("textToSpeech", async () => {
        const res = await textToSpeech('');
        
        // console.log(res)
        expect(res).toBeArray();

       
    });
    test("textToSpeechStream", async () => {
        const res = await textToSpeechStream('');
        
        // console.log(res)
        expect(res).toBeArray();

       
    });
   
     test("getVoices", async () => {
        const res = await getVoices();
        
        // console.log(res)
        expect(res).toBeArray();

       
     });
    
    test("getVoice", async () => {
        const res = await getVoice();
        
        // console.log(res)
        expect(res).toBeArray();
    });

  test("editVoiceSettings", async () => {
        const res = await editVoiceSettings();
        
        // console.log(res)
        expect(res).toBeArray();
  });
    
    test("getVoiceSettings", async () => {
        const res = await getVoiceSettings();
        
        // console.log(res)
        expect(res).toBeArray();
    });

    
    test("deleteVoice", async () => {
        const res = await deleteVoice();
        
        // console.log(res)
        expect(res).toBeArray();
    });

    test("getModels", async () => {
        const res = await getModels();
        
        // console.log(res)
        expect(res).toBeArray();
    });
    test("getUserInfo", async () => {
        const res = await getUserInfo();
        
        // console.log(res)
        expect(res).toBeArray();
    });
    test("getUserSubscription", async () => {
        const res = await getUserSubscription();
        
        // console.log(res)
        expect(res).toBeArray();
    });
    test("getDefaultVoiceSettings", async () => {
        const res = await getDefaultVoiceSettings();
        
        // console.log(res)
        expect(res).toBeArray();
    });
   
 
    

})