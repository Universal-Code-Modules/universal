const models = {
    nlp:[
        {name:'gpt-4-0125-preview', prices:{tokens:{prompt:0.00001, completion:0.00003}, limits:{context:128}}},
        {name:'gpt-4-1106-preview', prices:{tokens:{prompt:0.00001, completion:0.00003}, limits:{context:128}}},
        {name:'gpt-4-1106-vision-preview', prices:{tokens:{prompt:0.00001, completion:0.00003}, limits:{context:{min:85, max:4096}}, 
        calculate:(widthPx, heightPx, lowRes = false) => {
            let tokens = 85
            return widthPx * heightPx * 0.0000001}}},
    ]
    
}
const tiers = {}



module.exports = {models, tiers };