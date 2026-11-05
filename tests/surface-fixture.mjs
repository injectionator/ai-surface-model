export function content() {
  return {research:{title:'Synthetic',scope:'One document; runtime unverified',extensions:{'urn:test:opaque':{keep:true}},
    sources:[{id:'urn:source:one',location:'guide.md',version:'working',digest:'sha256:'+'a'.repeat(64),inspectedAt:'2026-11-05T12:00:00Z',coverage:[{path:'guide.md:1',status:'inspected',note:'One line'}]}],
    findings:[{id:'urn:f:app',subject:'urn:node:app',property:'role',state:'known',note:'Declared app',claims:[{value:'app',evidence:[{source:'urn:source:one',locator:'line 1'}]}]}],
    alternatives:[{id:'urn:a:oidc',title:'OIDC',findings:['urn:f:app'],requirements:[]}],
    decisions:[{id:'urn:d:oidc',alternative:'urn:a:oidc',choice:'rejected',reason:'Human choice',by:'human',at:'2026-11-05T12:00:00Z'}],questions:[],notes:[]},
    surface:{title:'Partial',scope:'Declared only',extensions:{},kind:'definition',vocabularies:[{id:'urn:v:test',version:'0.1'}],nodes:[{id:'urn:node:app',label:'App',type:{vocabulary:'urn:v:test',term:'application'},attributes:{},basis:[{items:['urn:f:app']}],requirements:['urn:r:config']}],relationships:[],requirements:[{id:'urn:r:config',kind:'configuration',description:'Select model',state:'unknown'}],coverage:['One document'],gaps:['Model unknown']}};
}
