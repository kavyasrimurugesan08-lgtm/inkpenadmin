const K='inkpen-admin-v3';
const SEED={sample:true,range:'week',
 site:{phone:'+1 (800) 555-4657',email:'contact@inkpen.ink',address:'742 Innovation Way, CA 94107',social:{instagram:'https://www.instagram.com/inkpen.official/',facebook:'',linkedin:'',x:''},twofa:false,logo:''},
 content:{
  heroPill:'🎓 The Nexus of Tech, Media & Academy',
  heroLine1:'Where Curiosity',
  heroLine2:'Writes The',
  heroLine3:'Future',
  heroSub:'An interdisciplinary power combining high-velocity technology engineering, cinematic creative media, and transformative industry academies.',
  heroBtn:'Explore Our Work →',
  storyEyebrow:'The story',
  storyHeading:'A boy, a sheep, and a question.',
  storyLine1:'Once, a curious boy followed a wandering sheep over the hill.',
  storyLine2:'Every step raised a question. Every question left a mark.',
  storyLine3:'That trail of ink became INKPEN.',
  divEyebrow:'Three divisions',
  divHeading:'One pen. Three crafts.',
  techTitle:'TECH',
  techDesc:'Enterprise software engineering built to scale.',
  academyTitle:'ACADEMY',
  academyDesc:'Industry education that turns curiosity into capability.',
  mediaTitle:'MEDIA',
  mediaDesc:'Cinematic media production with a storyteller’s eye.',
  stat1Num:'3',stat1Label:'Divisions',
  stat2Num:'120',stat2Label:'Projects',
  stat3Num:'2500',stat3Label:'Learners',
  stat4Num:'98',stat4Label:'Satisfaction',
  ctaHeading:'Let’s write what’s next.',
  ctaSub:'Tell us about your idea. We’ll reply with a plan.',
  footerBio:'Where curiosity writes the future. An interdisciplinary power uniting cutting-edge digital technology, cinematic media storytelling, and world-class educational academies.'
 },
 visits:{day:[212,248,231,276,302,198,167],week:[1480,1622,1555,1710,1893,1678,1930,2041],month:[5210,5630,6012,6480,6105,6890,7320,7015,7760,8120,8640,9010]},
 cats:[{id:'c1',name:'Web Design'},{id:'c2',name:'Marketing'},{id:'c3',name:'Branding'}],
 projects:[{id:'p1',title:'Storefront Redesign',category:'Web Design',description:'High-conversion storefront architecture and UI engineering.',image:''},{id:'p2',title:'Brand Launch Campaign',category:'Marketing',description:'',image:''}],
 services:[{id:'s1',name:'Web Development',price:'Custom quote',description:'',status:'Live'},{id:'s2',name:'AI & Automation',price:'Custom quote',description:'',status:'Live'}],
 leads:[{id:'l1',name:'Avery Chen',email:'avery@example.com',phone:'',message:'Interested in a website refresh.',date:'2026-11-03',status:'New'},{id:'l2',name:'Jordan Ellis',email:'jordan@example.com',phone:'+1 555 0100',message:'Asking about a brand identity.',date:'2026-11-01',status:'Replied'}],
 reviews:[{id:'r1',author:'Elena Rostova',company:'Nova Systems',quote:'Clear communication and fast delivery.',status:'Approved'},{id:'r2',author:'Marcus Vance',company:'Apex Labs',quote:'Helpful team from start to finish.',status:'Hidden'}],
 logos:[],
 jobs:[{id:'j1',title:'Frontend Developer',division:'Tech',type:'Full-time',location:'Remote',description:'Build polished web interfaces for client projects.',status:'Open'},{id:'j2',title:'Video Editor',division:'Media',type:'Contract',location:'Chennai',description:'Edit short-form and long-form video content for campaigns.',status:'Open'},{id:'j3',title:'Academy Instructor',division:'Academy',type:'Part-time',location:'Remote',description:'Deliver online sessions on design or technology topics.',status:'Closed'}],
 team:[]
};
const VIEWS=[['dash','Dashboard'],['content','Website content'],['projects','Projects'],['services','Services'],['cats','Categories'],['leads','Inquiries'],['reviews','Testimonials'],['logos','Client logos'],['team','Team profiles'],['jobs','Job openings'],['settings','Settings']];
const C={
 projects:{t:'Project',f:[['title','Project title'],['category','Category','cat'],['description','Short description','ta'],['image','Screenshot URL']],c:['title','category']},
 services:{t:'Service',f:[['name','Service name'],['price','Pricing details'],['description','Description','ta'],['status','Visibility','sel','Live,Hidden']],c:['name','price','status']},
 cats:{t:'Category',f:[['name','Category name']],c:['name']},
 jobs:{t:'Job opening',f:[['title','Job title'],['division','Division','sel','Tech,Academy,Media,Corporate'],['type','Type','sel','Full-time,Part-time,Contract,Internship'],['location','Location'],['description','Description','ta'],['status','Visibility','sel','Open,Closed']],c:['title','division','type','status']},
 reviews:{t:'Testimonial',f:[['author','Client name'],['company','Company'],['quote','Review','ta'],['status','Visibility','sel','Approved,Hidden']],c:['author','company','status']},
 logos:{t:'Client logo',f:[['company','Company name'],['url','Logo image URL']],c:['company']},
 team:{t:'Team member',f:[['name','Name'],['role','Designation'],['url','Photo URL']],c:['name','role']}
};
window.K=K;window.SEED=SEED;window.VIEWS=VIEWS;window.C=C;
