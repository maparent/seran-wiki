const { stat } = Deno;
export let metaPages = {};

// function route(url:string, fn) {
//   metaPages[url] = fn;
// }

let metaText = `
Welcome Visitors

  Welcome to this [[DenoWiki]] Federated Wiki site.
  From this page you can find who we are and what we do.
  New sites provide this information and then claim the site as their own.
  You will need your own site to participate.

  Pages about us.

  [[Ward Cunningham]]

  Pages where we do and share.

  [[Region Scraper]]


Region Scraper

  Here we supervise the ongoing scrape of the wiki federation.
  We invision this as cooperating loops where sitemap fetches lead
  to page fetches and these lead to more sitemap fetches.

  See [[Stepping the Async Scrape]]

  While developing this technology we focus first on a nested loop.
  We have several versions of this where we explore different instrumentation strategies.

  [[Mock Computation]]

  [[Triple Controls]]

Mock Computation

  Here we start, stop and step a triple nested loop that counts iterations
  until five of each, for 5 * 5 * 5 total iterations have completed.
  See also [[Triple Controls]] of the same loop

  process-step:
    legend: "Simple Nested Loop",
    href: "/simple"

Triple Controls

  Here we start, stop and step with distinct controls for each nesting level.

  process-step:
    legend: "Outer Nested Loop",
    href: "/outer"

  process-step:
    legend: "Middle Nested Loop",
    href: "/middle"

  process-step:
    legend: "Inner Nested Loop",
    href: "/inner"`


function asSlug(title) {
  return title.replace(/\s/g, "-").replace(/[^A-Za-z0-9-]/g, "").toLowerCase();
}

function parse(sep, text, fn) {
  let v = text.split(sep)
  for(let i = 1; i<v.length; i+=2)
    fn(v[i], v[i+1])
}

parse(/\n([A-Z][A-Za-z ]*)/g, metaText, (title, body) => {
  let page = {title,story:[]}
  parse(/(\n\n\s*)/g, body, (blank, text) => {
    let id = Math.floor(Math.random()*2**58).toString(36)
    let m = text.match(/([a-z-]+):/)
    if (m) {
      let args = eval(`({${text.replace(/([a-z-]+):/,'')}})`)
      page.story.push(Object.assign({type:m[1],id},args))
    } else {
      page.story.push({type:'paragraph',text,id})
    }
  })
  metaPages[`/${asSlug(title)}.json`] = async (req, site, _system) => {site.serveJson(req, page)}
})


