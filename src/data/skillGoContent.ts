import { Phrase, DrillItem, ApplyScenario } from './skillGoTypes';

export const U1_PHRASES: Phrase[] = [
  {hi:"मुझे मदद चाहिए", en:"I need help", pron:"aai need help"},
  {hi:"कहाँ है?", en:"Where is it?", pron:"vear iz it"},
  {hi:"यह टूटा हुआ है", en:"This is broken", pron:"dhis iz broh-ken"},
  {hi:"मुझे समझ नहीं आया", en:"I did not understand", pron:"aai did not undar-stand"},
  {hi:"कृपया दोबारा बोलिए", en:"Please say it again", pron:"pleez say it uh-gen"},
  {hi:"मैं अभी आता हूँ", en:"I am coming now", pron:"aai am kuh-ming now"},
  {hi:"यह तैयार है", en:"This is ready", pron:"dhis iz reh-dee"},
  {hi:"कितने बजे?", en:"What time?", pron:"vot taim"},
  {hi:"मुझे देर हो गई", en:"I am late", pron:"aai am layt"},
  {hi:"धन्यवाद, समझ गया", en:"Thank you, I understood", pron:"thaenk yoo, aai un-dar-stood"},
];

export const U1_DRILL: DrillItem[] = [
  {type:"mcq", hi:"मुझे मदद चाहिए", correct:"I need help", options:["I need help","I am late","Where is it","This is ready"]},
  {type:"mcq", hi:"कहाँ है?", correct:"Where is it?", options:["What time?","Where is it?","I need help","This is broken"]},
  {type:"blank", hi:"यह टूटा ___ है", correctWords:["broken"], full:"This is broken", promptEn:"This is ___"},
  {type:"mcq", hi:"मुझे समझ नहीं आया", correct:"I did not understand", options:["I did not understand","I am coming now","This is ready","Please say it again"]},
  {type:"mcq", hi:"कृपया दोबारा बोलिए", correct:"Please say it again", options:["Thank you, I understood","Please say it again","What time?","I am late"]},
  {type:"blank", hi:"मैं अभी ___ हूँ", correctWords:["coming"], full:"I am coming now", promptEn:"I am ___ now"},
  {type:"mcq", hi:"यह तैयार है", correct:"This is ready", options:["This is broken","I need help","This is ready","I am late"]},
  {type:"mcq", hi:"कितने बजे?", correct:"What time?", options:["Where is it?","What time?","I am late","This is ready"]},
];

export const U2_PHRASES: Phrase[] = [
  {hi:"मैं हर सुबह स्टॉक चेक करता हूँ", en:"I check the stock every morning.", pron:"aai chek dhuh stock ev-ree mor-ning", tense:"Present"},
  {hi:"उसने कल स्टॉक चेक किया", en:"He checked the stock yesterday.", pron:"hee chekt dhuh stock yes-tar-day", tense:"Past"},
  {hi:"मैं कल स्टॉक चेक करूँगा", en:"I will check the stock tomorrow.", pron:"aai vil chek dhuh stock tuh-mor-oh", tense:"Future"},
  {hi:"उसके पास चाबी है", en:"He has the key.", pron:"hee haz dhuh kee", tense:"Present · has"},
  {hi:"उसके पास चाबी थी", en:"He had the key.", pron:"hee had dhuh kee", tense:"Past · had"},
  {hi:"ये बॉक्स तैयार हैं", en:"These boxes are ready.", pron:"dheez bok-siz aar reh-dee", tense:"Present · are"},
  {hi:"ये बॉक्स तैयार थे", en:"These boxes were ready.", pron:"dheez bok-siz vur reh-dee", tense:"Past · were"},
  {hi:"ये बॉक्स कल तैयार होंगे", en:"These boxes will be ready tomorrow.", pron:"dheez bok-siz vil bee reh-dee tuh-mor-oh", tense:"Future · will be"},
  {hi:"आप 1 बजे ब्रेक ले सकते हैं", en:"You may take a break at 1 PM.", pron:"yoo may tayk uh brayk at van pee-em", tense:"Modal · may"},
  {hi:"क्या आपने लिस्ट चेक की?", en:"Did you check the list?", pron:"did yoo chek dhuh list", tense:"Question · did"},
];

export const U2_DRILL: DrillItem[] = [
  {type:"mcq", hi:"उसके पास चाबी है", correct:"He has the key.", options:["He has the key.","He have the key.","He is has the key.","He having the key."]},
  {type:"mcq", hi:"ये बॉक्स तैयार हैं (spot the correct one)", correct:"These boxes are ready.", options:["These boxes is ready.","These boxes be ready.","These boxes are ready.","These boxes am ready."]},
  {type:"builder", hi:"ये बॉक्स तैयार हैं", target:"These boxes are ready.", words:["These","boxes","are","ready."]},
  {type:"mcq", hi:"उसने कल स्टॉक चेक किया", correct:"He checked the stock yesterday.", options:["He checked the stock yesterday.","He check the stock yesterday.","He checking the stock yesterday.","He will check the stock yesterday."]},
  {type:"mcq", hi:"correct sentence?", correct:"These boxes were ready.", options:["These boxes was ready.","These boxes were ready.","These boxes is ready.","These boxes will ready."]},
  {type:"builder", hi:"मैं कल स्टॉक चेक करूँगा", target:"I will check the stock tomorrow.", words:["I","will","check","the","stock","tomorrow."]},
  {type:"mcq", hi:"आप 1 बजे ब्रेक ले सकते हैं", correct:"You may take a break at 1 PM.", options:["You may take a break at 1 PM.","You may to take a break at 1 PM.","You will may take a break at 1 PM.","You maying take a break at 1 PM."]},
  {type:"mcq", hi:"क्या आपने लिस्ट चेक की?", correct:"Did you check the list?", options:["Did you checked the list?","Do you checked the list?","Did you check the list?","You checked the list?"]},
];

export const U1_APPLY: ApplyScenario[] = [
  {situation:"Your supervisor points at a damaged pallet and asks what's wrong.", hi:"(पैलेट खराब है)", correct:"This is broken", options:["This is broken","I am late","What time?","Thank you, I understood"]},
  {situation:"A colleague speaks too fast and you missed it.", hi:"(समझ नहीं आया)", correct:"Please say it again", options:["I need help","Please say it again","This is ready","Where is it?"]},
  {situation:"You're 10 minutes late to your shift.", hi:"(देर से पहुंचे)", correct:"I am late", options:["I am coming now","I am late","This is broken","What time?"]},
  {situation:"You can't find the scanner.", hi:"(स्कैनर नहीं मिल रहा)", correct:"Where is it?", options:["Where is it?","I need help","This is ready","Thank you, I understood"]},
  {situation:"Supervisor explains a task and asks 'Understood?' You did.", hi:"(आप समझ गए)", correct:"Thank you, I understood", options:["I did not understand","Please say it again","Thank you, I understood","I am late"]}
];

export const U2_APPLY: ApplyScenario[] = [
  {situation:"Your supervisor asks what you do every morning before shift starts.", hi:"(रोज़ सुबह की आदत)", correct:"I check the stock every morning.", options:["I check the stock every morning.","I checked the stock every morning.","I will check the stock every morning.","I checking the stock every morning."]},
  {situation:"Supervisor asks if you finished checking stock yesterday.", hi:"(कल का काम)", correct:"I checked the stock yesterday.", options:["I check the stock yesterday.","I will check the stock yesterday.","I checked the stock yesterday.","I am check the stock yesterday."]},
  {situation:"A colleague asks if the boxes are ready right now.", hi:"(अभी की स्थिति)", correct:"These boxes are ready.", options:["These boxes is ready.","These boxes are ready.","These boxes was ready.","These box are ready."]},
  {situation:"Supervisor asks about tomorrow's shipment status.", hi:"(कल की स्थिति)", correct:"These boxes will be ready tomorrow.", options:["These boxes are ready tomorrow.","These boxes will ready tomorrow.","These boxes will be ready tomorrow.","These boxes was ready tomorrow."]},
  {situation:"A new colleague asks if they can take lunch at 1 PM — you confirm policy.", hi:"(अनुमति बताना)", correct:"You may take a break at 1 PM.", options:["You may take a break at 1 PM.","You can to take a break at 1 PM.","You will may take a break at 1 PM.","You may taking a break at 1 PM."]}
];

