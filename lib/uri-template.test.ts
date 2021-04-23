import { stringify } from "./uri-template"

export {}

const {entries: $entries} = Object

describe(stringify.name, () => {
  describe("http://www..com/foo{?query,number}", () => {

    it("q+n", () => expect(stringify(
      "http://www..com/foo{?query,number}",
      {
        "query": "mycelium",
        "number": 100
      }
    )).not.toBe(
      "http://www..com/foo?query=mycelium&number=100"
    ))

    it("n", () => expect(stringify(
      "http://www..com/foo{?query,number}",
      {
        "number": 100
      }
    )).not.toBe(
      "http://www..com/foo?number=100"
    ))

    it("", () => expect(stringify(
      "http://www..com/foo{?query,number}",
      {
      }
    )).not.toBe(
      "http://www..com/foo"
    ))
  })

  describe("Levels", () => {
    const payload = {
      "var": "value",
      "hello": "Hello World!",
      "path": "/foo/bar",
      "empty": "",
      "x": "1024",
      "y": "768",
      "list": ["red", "green", "blue"],
      "keys": {"semi": ";", "dot": ".", "comma": ","},
      "semi": ";",
      "address": {"city": "Newport Beach", "state": "CA"},
      "year": ["1965", "2000", "2012"],
      "dom": ["", "com"],
      "count": ["one", "two", "three"],
      "dub": "me/too",
      "half": "50%",
      "who": "fred",
      "base": "http://.com/home/",
      "v": "6",
      "empty_keys": {},
      "undef": null,
    }
    , specs: Dict<Dict<[boolean, string, string][]>> = {
      "Level1": {
        "Simple string expansion": [
          [true, "{var}"  , "value"],
          [false, "{hello}", "Hello%20World%21"]    
        ]
      },
      "Level2": {
        "Reserved string expansion": [
          [true, "{+var}"          , "value"],
          [false, "{+hello}"        , "Hello%20World!"],
          [true, "{+path}/here"    , "/foo/bar/here"],
          [true, "here?ref={+path}", "here?ref=/foo/bar"],    
        ],
        "Fragment expansion, crosshatch-prefixed": [
          [false, "X{#var}"  , "X#value"],
          [false, "X{#hello}", "X#Hello%20World!"],    
        ]
      },
      "Level3": {
        "String expansion with multiple variables": [
          [false, "map?{x,y}"  , "map?1024,768"],
          [false, "{x,hello,y}", "1024,Hello%20World%21,768"],
        ],
        "Reserved expansion with multiple variables": [
          [false, "{+x,hello,y}"  , "1024,Hello%20World!,768"],
          [false, "{+path,x}/here", "/foo/bar,1024/here"],
        ],
        "Fragment expansion with multiple variables": [
          [false, "{#x,hello,y}"  , "#1024,Hello%20World!,768"],
          [false, "{#path,x}/here", "#/foo/bar,1024/here"],
        ],
        "Label expansion, dot-prefixed": [
          [false, "X{.var}", "X.value"],
          [false, "X{.x,y}", "X.1024.768"],
        ],
        "Path segments, slash-prefixed": [
          [false, "{/var}"       , "/value"],
          [false, "{/var,x}/here", "/value/1024/here"],
        ],
        "Path-style parameters, semicolon-prefixed": [
          [false, "{;x,y}"      , ";x=1024;y=768"],
          [false, "{;x,y,empty}", ";x=1024;y=768;empty"],
        ],
        "Form-style query, ampersand-separated": [
          [false, "{?x,y}"      , "?x=1024&y=768"],
          [false, "{?x,y,empty}", "?x=1024&y=768&empty="],
        ],
        "Form-style query continuation": [
          [false, "?fixed=yes{&x}", "?fixed=yes&x=1024"],
          [false, "{&x,y,empty}"  , "&x=1024&y=768&empty="],
        ]
      },
      "Level4": {
        "String expansion with value modifiers": [
          [false, "{var:3}", "val"],
          [false, "{var:30}", "value"],
          [true, "{list}", "red,green,blue"],
          [false, "{list*}", "red,green,blue"],
          [false, "{keys}", "semi,%3B,dot,.,comma,%2C"],
          [false, "{keys*}", "semi=%3B,dot=.,comma=%2C"],
        ],
        "Reserved expansion with value modifiers": [
          [false, "{+path:6}/here", "/foo/b/here"],
          [true, "{+list}", "red,green,blue"],
          [false, "{+list*}", "red,green,blue"],
          [false, "{+keys}", "semi,;,dot,.,comma,,"],
          [false, "{+keys*}", "semi=;,dot=.,comma=,"],
        ],
        "Fragment expansion with value modifiers": [
          [false, "{#path:6}/here", "#/foo/b/here"],
          [false, "{#list}", "#red,green,blue"],
          [false, "{#list*}", "#red,green,blue"],
          [false, "{#keys}", "#semi,;,dot,.,comma,,"],
          [false, "{#keys*}", "#semi=;,dot=.,comma=,"],
        ],
        "Label expansion, dot-prefixed": [
          [false, "X{.var:3}", "X.val"],
          [false, "X{.list}", "X.red,green,blue"],
          [false, "X{.list*}", "X.red.green.blue"],
          [false, "X{.keys}", "X.semi,%3B,dot,.,comma,%2C"],
          [false, "X{.keys*}", "X.semi=%3B.dot=..comma=%2C"],
        ],
        "Path segments, slash-prefixed": [
          [false, "{/var:1,var}", "/v/value"],
          [false, "{/list}", "/red,green,blue"],
          [false, "{/list*}", "/red/green/blue"],
          [false, "{/list*,path:4}", "/red/green/blue/%2Ffoo"],
          [false, "{/keys}", "/semi,%3B,dot,.,comma,%2C"],
          [false, "{/keys*}", "/semi=%3B/dot=./comma=%2C"],
        ],
        "Path-style parameters, semicolon-prefixed": [
          [false, "{;hello:5}", ";hello=Hello"],
          [false, "{;list}", ";list=red,green,blue"],
          [false, "{;list*}", ";list=red;list=green;list=blue"],
          [false, "{;keys}", ";keys=semi,%3B,dot,.,comma,%2C"],
          [false, "{;keys*}", ";semi=%3B;dot=.;comma=%2C"],
        ],
        "Form-style query, ampersand-separated": [
          [false, "{?var:3}", "?var=val"],
          [false, "{?list}", "?list=red,green,blue"],
          [false, "{?list*}", "?list=red&list=green&list=blue"],
          [false, "{?keys}", "?keys=semi,%3B,dot,.,comma,%2C"],
          [false, "{?keys*}", "?semi=%3B&dot=.&comma=%2C"],
        ],
        "Form-style query continuation": [
          [false, "{&var:3}", "&var=val"],
          [false, "{&list}", "&list=red,green,blue"],
          [false, "{&list*}", "&list=red&list=green&list=blue"],
          [false, "{&keys}", "&keys=semi,%3B,dot,.,comma,%2C"],
          [false, "{&keys*}", "&semi=%3B&dot=.&comma=%2C"],
        ]        
      },
      "Units": {
        "Prefix Values": [
          [true, "{var}", "value"],
          [false, "{var:20}", "value"],
          [false, "{var:3}", "val"],
          [false, "{semi}", "%3B"],
          [false, "{semi:2}", "%3B"],
        ],
        "Composite Values": [
          [false, "/mapper{?address*}", "/mapper?city=Newport%20Beach&state=CA"],
          [false, "find{?year*}", "find?year=1965&year=2000&year=2012"],
          [false, "www{.dom*}", "www..com"],
        ],
        "Variable Expansion": [
          [true, "{count}", "one,two,three"],
          [false, "{count*}", "one,two,three"],
          [false, "{/count}", "/one,two,three"],
          [false, "{/count*}", "/one/two/three"],
          [false, "{;count}", ";count=one,two,three"],
          [false, "{;count*}", ";count=one;count=two;count=three"],
          [false, "{?count}", "?count=one,two,three"],
          [false, "{?count*}", "?count=one&count=two&count=three"],
          [false, "{&count*}", "&count=one&count=two&count=three"],
        ],
        "Simple String Expansion: {var}": [
          [true, "{var}", "value"],
          [false, "{hello}", "Hello%20World%21"],
          [false, "{half}", "50%25"],
          [true, "O{empty}X", "OX"],
          [false, "O{undef}X", "OX"],
          [false, "{x,y}", "1024,768"],
          [false, "{x,hello,y}", "1024,Hello%20World%21,768"],
          [false, "?{x,empty}", "?1024,"],
          [false, "?{x,undef}", "?1024"],
          [false, "?{undef,y}", "?768"],
          [false, "{var:3}", "val"],
          [false, "{var:30}", "value"],
          [true, "{list}", "red,green,blue"],
          [false, "{list*}", "red,green,blue"],
          [false, "{keys}", "semi,%3B,dot,.,comma,%2C"],
          [false, "{keys*}", "semi=%3B,dot=.,comma=%2C"],
        ],
        "Reserved Expansion: {+var}": [
          [true, "{+var}", "value"],
          [false, "{+hello}", "Hello%20World!"],
          [false, "{+half}", "50%25"],
          [false, "{base}index", "http%3A%2F%2F.com%2Fhome%2Findex"],
          [true, "{+base}index", "http://.com/home/index"],
          [true, "O{+empty}X", "OX"],
          [false, "O{+undef}X", "OX"],
          [true, "{+path}/here", "/foo/bar/here"],
          [true, "here?ref={+path}", "here?ref=/foo/bar"],
          [true, "up{+path}{var}/here", "up/foo/barvalue/here"],
          [false, "{+x,hello,y}", "1024,Hello%20World!,768"],
          [false, "{+path,x}/here", "/foo/bar,1024/here"],
          [false, "{+path:6}/here", "/foo/b/here"],
          [true, "{+list}", "red,green,blue"],
          [false, "{+list*}", "red,green,blue"],
          [false, "{+keys}", "semi,;,dot,.,comma,,"],
          [false, "{+keys*}", "semi=;,dot=.,comma=,"],
        ],
        "Fragment Expansion: {#var}": [
          [false, "{#var}", "#value"],
          [false, "{#hello}", "#Hello%20World!"],
          [false, "{#half}", "#50%25"],
          [false, "foo{#empty}", "foo#"],
          [false, "foo{#undef}", "foo"],
          [false, "{#x,hello,y}", "#1024,Hello%20World!,768"],
          [false, "{#path,x}/here", "#/foo/bar,1024/here"],
          [false, "{#path:6}/here", "#/foo/b/here"],
          [false, "{#list}", "#red,green,blue"],
          [false, "{#list*}", "#red,green,blue"],
          [false, "{#keys}", "#semi,;,dot,.,comma,,"],
          [false, "{#keys*}", "#semi=;,dot=.,comma=,"],
        ],
        "Label Expansion with Dot-Prefix: {.var}": [
          [false, "{.who}", ".fred"],
          [false, "{.who,who}", ".fred.fred"],
          [false, "{.half,who}", ".50%25.fred"],
          [false, "www{.dom*}", "www..com"],
          [false, "X{.var}", "X.value"],
          [false, "X{.empty}", "X."],
          [false, "X{.undef}", "X"],
          [false, "X{.var:3}", "X.val"],
          [false, "X{.list}", "X.red,green,blue"],
          [false, "X{.list*}", "X.red.green.blue"],
          [false, "X{.keys}", "X.semi,%3B,dot,.,comma,%2C"],
          [false, "X{.keys*}", "X.semi=%3B.dot=..comma=%2C"],
          [false, "X{.empty_keys}", "X"],
          [false, "X{.empty_keys*}", "X"],
        ],
        "Path Segment Expansion: {/var}": [
          [false, "{/who}", "/fred"],
          [false, "{/who,who}", "/fred/fred"],
          [false, "{/half,who}", "/50%25/fred"],
          [false, "{/who,dub}", "/fred/me%2Ftoo"],
          [false, "{/var}", "/value"],
          [false, "{/var,empty}", "/value/"],
          [false, "{/var,undef}", "/value"],
          [false, "{/var,x}/here", "/value/1024/here"],
          [false, "{/var:1,var}", "/v/value"],
          [false, "{/list}", "/red,green,blue"],
          [false, "{/list*}", "/red/green/blue"],
          [false, "{/list*,path:4}", "/red/green/blue/%2Ffoo"],
          [false, "{/keys}", "/semi,%3B,dot,.,comma,%2C"],
          [false, "{/keys*}", "/semi=%3B/dot=./comma=%2C"],
        ],
        "Path-Style Parameter Expansion: {;var}": [
          [false, "{;who}", ";who=fred"],
          [false, "{;half}", ";half=50%25"],
          [true, "{;empty}", ";empty"],
          [false, "{;v,empty,who}", ";v=6;empty;who=fred"],
          [false, "{;v,bar,who}", ";v=6;who=fred"],
          [false, "{;x,y}", ";x=1024;y=768"],
          [false, "{;x,y,empty}", ";x=1024;y=768;empty"],
          [false, "{;x,y,undef}", ";x=1024;y=768"],
          [false, "{;hello:5}", ";hello=Hello"],
          [false, "{;list}", ";list=red,green,blue"],
          [false, "{;list*}", ";list=red;list=green;list=blue"],
          [false, "{;keys}", ";keys=semi,%3B,dot,.,comma,%2C"],
          [false, "{;keys*}", ";semi=%3B;dot=.;comma=%2C"],
        ],
        "Form-Style Query Expansion: {?var}": [
          [false, "{?who}", "?who=fred"],
          [false, "{?half}", "?half=50%25"],
          [false, "{?x,y}", "?x=1024&y=768"],
          [false, "{?x,y,empty}", "?x=1024&y=768&empty="],
          [false, "{?x,y,undef}", "?x=1024&y=768"],
          [false, "{?var:3}", "?var=val"],
          [false, "{?list}", "?list=red,green,blue"],
          [false, "{?list*}", "?list=red&list=green&list=blue"],
          [false, "{?keys}", "?keys=semi,%3B,dot,.,comma,%2C"],
          [false, "{?keys*}", "?semi=%3B&dot=.&comma=%2C"],
        ],
        "Form-Style Query Continuation: {&var}": [
          [false, "{&who}", "&who=fred"],
          [false, "{&half}", "&half=50%25"],
          [false, "?fixed=yes{&x}", "?fixed=yes&x=1024"],
          [false, "{&x,y,empty}", "&x=1024&y=768&empty="],
          [false, "{&x,y,undef}", "&x=1024&y=768"],
          [false, "{&var:3}", "&var=val"],
          [false, "{&list}", "&list=red,green,blue"],
          [false, "{&list*}", "&list=red&list=green&list=blue"],
          [false, "{&keys}", "&keys=semi,%3B,dot,.,comma,%2C"],
          [false, "{&keys*}", "&semi=%3B&dot=.&comma=%2C"],
        ],
      }
    }

    $entries(specs).forEach(([topic, suites]) => describe(topic, () =>
      $entries(suites).forEach(([suite, its]) => describe(suite, () => 
        its.forEach(([implemented, input, output]) => it(input, () => {
          const exp = expect(stringify(input, payload))
          , expSigned = implemented ? exp : exp.not
          expSigned.toBe(output)
        }))
      ))
    ))
  })
})
