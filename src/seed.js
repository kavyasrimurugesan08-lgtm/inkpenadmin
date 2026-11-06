const K='inkpen-admin-v3';
const SEED={sample:true,range:'week',
 site:{phone:'+1 (800) 555-4657',email:'contact@inkpen.ink',address:'742 Innovation Way, CA 94107',social:{instagram:'https://www.instagram.com/inkpen.official/',facebook:'',linkedin:'',x:''},twofa:false,logo:''},
 visits:{day:[212,248,231,276,302,198,167],week:[1480,1622,1555,1710,1893,1678,1930,2041],month:[5210,5630,6012,6480,6105,6890,7320,7015,7760,8120,8640,9010]},
 cats:[{id:'c1',name:'Web Design'},{id:'c2',name:'Marketing'},{id:'c3',name:'Branding'}],
 projects:[{id:'p1',title:'Sample: storefront redesign',category:'Web Design',description:'Replace with a real project.',image:''},{id:'p2',title:'Sample: launch campaign',category:'Marketing',description:'',image:''}],
 services:[{id:'s1',name:'Web Development',price:'Custom quote',description:'',status:'Live'},{id:'s2',name:'AI & Automation',price:'Custom quote',description:'',status:'Live'}],
 leads:[{id:'l1',name:'Sample: Avery Chen',email:'avery@example.com',phone:'',message:'Interested in a website refresh.',date:'2026-11-03',status:'New'},{id:'l2',name:'Sample: Jordan Ellis',email:'jordan@example.com',phone:'+1 555 0100',message:'Asking about a brand identity.',date:'2026-11-01',status:'Replied'}],
 reviews:[{id:'r1',author:'Sample client',company:'Example Co',quote:'Clear communication and fast delivery.',status:'Approved'},{id:'r2',author:'Sample client two',company:'Example Labs',quote:'Helpful team from start to finish.',status:'Hidden'}],
 logos:[],
 jobs:[{id:'j1',title:'Frontend Developer',division:'Tech',type:'Full-time',location:'Remote',description:'Build polished web interfaces for client projects.',status:'Open'},{id:'j2',title:'Video Editor',division:'Media',type:'Contract',location:'Chennai',description:'Edit short-form and long-form video content for campaigns.',status:'Open'},{id:'j3',title:'Academy Instructor',division:'Academy',type:'Part-time',location:'Remote',description:'Deliver online sessions on design or technology topics.',status:'Closed'}],
 team:[{id:'t1',name:'Sample member',role:'Creative Director',url:''}]
};
const VIEWS=[['dash','Dashboard'],['projects','Projects'],['services','Services'],['cats','Categories'],['leads','Inquiries'],['reviews','Testimonials'],['logos','Client logos'],['team','Team profiles'],['jobs','Job openings'],['settings','Settings']];
const C={
 projects:{t:'Project',f:[['title','Project title'],['category','Category','cat'],['description','Short description','ta'],['image','Screenshot URL']],c:['title','category']},
 services:{t:'Service',f:[['name','Service name'],['price','Pricing details'],['description','Description','ta'],['status','Visibility','sel','Live,Hidden']],c:['name','price','status']},
 cats:{t:'Category',f:[['name','Category name']],c:['name']},
 jobs:{t:'Job opening',f:[['title','Job title'],['division','Division','sel','Tech,Academy,Media,Corporate'],['type','Type','sel','Full-time,Part-time,Contract,Internship'],['location','Location'],['description','Description','ta'],['status','Visibility','sel','Open,Closed']],c:['title','division','type','status']},
 reviews:{t:'Testimonial',f:[['author','Client name'],['company','Company'],['quote','Review','ta'],['status','Visibility','sel','Approved,Hidden']],c:['author','company','status']},
 logos:{t:'Client logo',f:[['company','Company name'],['url','Logo image URL']],c:['company']},
 team:{t:'Team member',f:[['name','Name'],['role','Designation'],['url','Photo URL']],c:['name','role']}
};
