export interface ProfileFieldDef {
  key: string;
  label: string;
  hint: string;
  placeholder: string;
  required: boolean;
}

export interface ProfileSectionDef {
  section: string;
  fields: ProfileFieldDef[];
}

export interface QuestionDef {
  id: number;
  cat: string;
  q: string;
  a: string;
  aFresher?: string;
}

export const PROFILE_FIELDS: ProfileSectionDef[] = [
  {section:"Work Area & Experience", fields:[
    {key:"jobArea", label:"Type of Work / Area", hint:"e.g. warehouse operations, retail sales", placeholder:"[warehouse / retail / delivery]", required:true},
    {key:"expYears", label:"Years of Experience", hint:"Leave blank if you are a fresher", placeholder:"[X years]", required:false}
  ]},
  {section:"Previous Job", fields:[
    {key:"company", label:"Previous Company Name", hint:"Optional — leave blank if not applicable", placeholder:"[Company]", required:false},
    {key:"role", label:"Previous Job Role", hint:"Optional — leave blank if not applicable", placeholder:"[role]", required:false},
    {key:"duration", label:"How Long You Worked There", hint:"Optional — e.g. 8 months", placeholder:"[duration]", required:false},
    {key:"tasks", label:"Main Tasks You Did", hint:"Optional — e.g. picking and packing orders", placeholder:"[tasks]", required:false},
    {key:"machineSystem", label:"Machines / Systems You've Used", hint:"Optional — e.g. RF scanner, POS machine, forklift", placeholder:"[RF scanner / POS machine / forklift]", required:false},
    {key:"teamSize", label:"Team Size You Worked With", hint:"Optional — e.g. 10", placeholder:"[X]", required:false}
  ]}
];

export const FALLBACKS: Record<string, string> = {
  "[Company]": "my previous company",
  "[role]": "that role",
  "[duration]": "a while",
  "[tasks]": "daily tasks like receiving and dispatching stock",
  "[RF scanner / POS machine / forklift]": "an RF scanner",
  "[X]": "several",
  "[X years]": "a few years",
  "[time]": "the start of my shift",
  "[receiving stock / picking orders / serving customers]": "receiving stock and picking orders",
  "[situation]": "an unexpected issue",
  "[counting / packing]": "packing",
  "[a specific machine, scanner, or system]": "this equipment",
  "[warehouse / retail / delivery]": "logistics and operations"
};

export function fillAnswer(text: string, profile: Record<string, any>): string {
  let out = text;
  if (profile.name) out = out.split('[Name]').join(profile.name);
  if (profile.city) out = out.split('[City]').join(profile.city);
  if (profile.education) out = out.split('[education]').join(profile.education);

  PROFILE_FIELDS.forEach(sec => {
    sec.fields.forEach(f => {
      const val = (profile[f.key] || '').trim();
      if (val) out = out.split(f.placeholder).join(val);
    });
  });
  if ((profile.jobArea || '').trim()) out = out.split('[area]').join(profile.jobArea.trim());
  Object.keys(FALLBACKS).forEach(ph => { out = out.split(ph).join(FALLBACKS[ph]); });
  out = out.split('[area]').join('this area');
  return out;
}

export function answerFor(item: QuestionDef, profile: Record<string, any>): string {
  const useFresher = profile.hasExperience === 'no' && item.aFresher;
  return fillAnswer(useFresher ? (item.aFresher as string) : item.a, profile);
}

export function structureChecklist(cat: string): string[] {
  const str = STRUCTURES[cat] || '';
  return str.split('→').map(s => s.trim());
}

export const STRUCTURES: Record<string, string> = {
  "About Yourself": "WHO you are → your BACKGROUND → ONE strength → WHY this job",
  "Background & Experience": "Company/role → main TASKS you did → ONE thing you learned",
  "Job Fit & Motivation": "What you like about the company → how your skills FIT → what you want long-term",
  "Work Situations": "The SITUATION → the ACTION you took → the RESULT (keep it short)",
  "Skills & Strengths": "Name the SKILL → give ONE example → say the IMPACT it had",
  "Closing & Logistics": "Give a DIRECT answer first → add ONE supporting detail"
};

export const QUESTIONS: QuestionDef[] = [
  {id:1,cat:"About Yourself",q:"Tell me about yourself.",a:"My name is [Name]. I am from [City]. I have completed [education] and have [X years] of experience in [warehouse / retail / delivery] work. I am hardworking, punctual, and good at working in a team. I am looking for a stable job where I can grow.",aFresher:"My name is [Name]. I am from [City]. I have completed [education]. I am a fresher with no work experience yet, but I am hardworking, punctual, and a quick learner. I am looking for a stable job in [warehouse / retail / delivery] work where I can grow."},
  {id:2,cat:"About Yourself",q:"Why do you want this job?",a:"I want this job because it matches my skills in [area]. I want to build a long-term career here. I am ready to learn and work hard."},
  {id:3,cat:"About Yourself",q:"What are your strengths?",a:"My strengths are punctuality, physical fitness, and teamwork. I can follow instructions carefully and I finish my work on time. I also stay calm when work is busy."},
  {id:4,cat:"About Yourself",q:"What is your weakness?",a:"Earlier I found it hard to use new machines quickly, but I have been practicing and now I learn new equipment faster. I always ask questions when I am not sure, instead of guessing."},
  {id:5,cat:"About Yourself",q:"Where do you see yourself in two years?",a:"In two years, I want to become more skilled in this job and take on more responsibility, like training new workers or becoming a team lead."},
  {id:6,cat:"Background & Experience",q:"Tell me about your previous job or experience.",a:"In my last job at [Company], I worked as [role] for [duration]. My daily work included [tasks].",aFresher:"I do not have previous work experience yet, but I have completed [education] and I am ready to learn quickly. I have prepared through training and I am confident I can pick up the tasks fast."},
  {id:7,cat:"Background & Experience",q:"Why did you leave your last job?",a:"I left my last job because I was looking for better growth and a more stable schedule. I want to work with a company that offers long-term opportunity.",aFresher:"This will be my first job, so I have not left any previous job. I am excited to start my career here and grow with this company."},
  {id:8,cat:"Background & Experience",q:"What was your daily routine in your last job?",a:"I usually started work at [time]. My tasks were [receiving stock / picking orders / serving customers]. I made sure my work area was clean and safe.",aFresher:"Since I have not worked before, I don't have a daily job routine to share yet, but I have prepared through training and I am ready to follow a structured routine here."},
  {id:9,cat:"Background & Experience",q:"Do you have experience with [a specific machine, scanner, or system]?",a:"Yes, I have used [RF scanner / POS machine / forklift] in my previous job. I am comfortable learning new systems quickly.",aFresher:"I have not used it in a job yet, but I have learned about it through training and I am confident I can pick it up quickly with a short demonstration."},
  {id:10,cat:"Background & Experience",q:"Have you worked in a team before?",a:"Yes, I have worked in teams of [X] people. We divided tasks and helped each other finish work on time, especially during busy hours.",aFresher:"I have worked in teams during my training and studies, where we divided tasks and supported each other to finish on time."},
  {id:11,cat:"Background & Experience",q:"Do you have any certifications or training?",a:"Yes, I have completed relevant training programs. This has helped me learn the necessary procedures."},
  {id:12,cat:"Job Fit & Motivation",q:"Why do you want to work here, for this company?",a:"I want to work here because this organization is known for strong growth and professional standards. I believe I can learn a lot and contribute effectively."},
  {id:13,cat:"Job Fit & Motivation",q:"What do you know about our company?",a:"I know that your company works in this industry and maintains high standards of quality and service. I researched this before coming for the interview."},
  {id:14,cat:"Job Fit & Motivation",q:"What type of work environment do you prefer?",a:"I prefer a work environment where the team supports each other and there are clear instructions. I also like a workplace that values safety and punctuality."},
  {id:15,cat:"Job Fit & Motivation",q:"Are you comfortable with shift work, including night shifts?",a:"Yes, I am comfortable working in shifts, including night shifts, as long as I know my schedule in advance."},
  {id:16,cat:"Job Fit & Motivation",q:"Are you comfortable with physical work, like lifting heavy items?",a:"Yes, I am physically fit and comfortable with tasks like lifting, standing for long hours, and moving around the work floor."},
  {id:17,cat:"Job Fit & Motivation",q:"Why should we hire you?",a:"You should hire me because I am hardworking, reliable, and eager to learn. I will show up on time and give my best effort every day."},
  {id:18,cat:"Work Situations",q:"How do you handle pressure or a very busy work day?",a:"When work is busy, I stay calm and focus on finishing one task at a time. I also ask for help from my team if needed so we can complete work on time."},
  {id:19,cat:"Work Situations",q:"Describe a time you solved a problem at work.",a:"Once, [situation] happened. I noticed the issue and informed my supervisor immediately, then helped resolve it. We finished on time without a bigger problem."},
  {id:20,cat:"Work Situations",q:"Describe a time you made a mistake. What did you do?",a:"I once made a small [counting / packing] error. I told my supervisor right away, and we corrected it before it caused a bigger issue. I learned to double-check my work."},
  {id:21,cat:"Work Situations",q:"How do you handle conflict with a co-worker?",a:"If I have a problem with a co-worker, I talk to them calmly and try to understand their side. If we cannot solve it, I inform my supervisor."},
  {id:22,cat:"Work Situations",q:"How do you handle an angry customer?",a:"I listen carefully to the customer, stay calm, and apologize for the trouble. I try to solve the problem, or ask my manager for help if needed."},
  {id:23,cat:"Work Situations",q:"Tell me about a time you worked under a tight deadline.",a:"During a busy period, we had many tasks to complete quickly. I focused on speed without skipping safety checks, and we finished before the deadline."},
  {id:24,cat:"Work Situations",q:"What will you do if you see a safety issue at work?",a:"I will stop the unsafe activity if possible, report it to my supervisor immediately, and make sure no one gets hurt."},
  {id:25,cat:"Work Situations",q:"How do you handle instructions that are unclear?",a:"If instructions are unclear, I ask my supervisor to explain again rather than guessing, so I complete the task correctly."},
  {id:26,cat:"Skills & Strengths",q:"How do you make sure you don't make errors in your work?",a:"I always double-check my work, like counting items twice or scanning barcodes carefully. I follow the checklist given by my supervisor."},
  {id:27,cat:"Skills & Strengths",q:"How do you stay motivated during repetitive work?",a:"I focus on doing my best in every task and remind myself that my work is important for the team. I also set small daily goals for myself."},
  {id:28,cat:"Skills & Strengths",q:"What is good customer service, in your opinion?",a:"Good customer service means listening to the customer, being polite, solving their problem quickly, and making them feel valued."},
  {id:29,cat:"Skills & Strengths",q:"What skills do you have that make you good for this job?",a:"I have strong attention to detail, good physical stamina, and clear communication skills. I am also a fast learner and follow instructions well."},
  {id:30,cat:"Skills & Strengths",q:"How do you learn new tasks or machines quickly?",a:"I watch carefully when someone shows me, take notes if needed, and practice until I am confident. I also ask questions if I am unsure."},
  {id:31,cat:"Skills & Strengths",q:"Are you willing to learn new skills for this job?",a:"Yes, I am always ready to learn new skills and improve myself for the job."},
  {id:32,cat:"Closing & Logistics",q:"What are your salary expectations?",a:"I am looking for a salary that matches my skills and the market standard for this role. I am open to discussing this further."},
  {id:33,cat:"Closing & Logistics",q:"When can you start?",a:"I am available to start as soon as required upon receiving an offer."},
  {id:34,cat:"Closing & Logistics",q:"Do you have any questions for us?",a:"Yes, could you tell me more about the training process and growth opportunities in this role?"},
  {id:35,cat:"Closing & Logistics",q:"Describe your ideal work environment.",a:"My ideal work environment is one that is safe, organized, and where the team supports each other to reach targets."}
];
