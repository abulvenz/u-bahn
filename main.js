import m from "mithril";
import tagl, { s } from "tagl-mithril";

const { div, svg, g, path, rect, text, circle } = tagl(m);
const { trunc, random } = Math;

const randomElementIndex = (arr) => trunc(random() * arr.length);
const without = (arr, idx) => arr.filter((e, i) => i !== idx);

const shuffle = (arr, result = []) =>
  arr.length === 0
    ? result
    : use(randomElementIndex(arr), (next) =>
        shuffle(without(arr, next), [...result, arr[next]])
      );

const range = (N, r = []) => (N === 0 ? r : range(N - 1, [...r, r.length]));
const use = (v, f) => f(v);
const size = innerWidth / 10;

const circleSize = size / 20;

const controlSize = size / 4;
const gap = 12;

const showConnectors = true;
const showControl = false;
const showNumbers = false;

const cards = [
  { g: "0123", count: 2 },
  { g: "0132", count: 2 },
  { g: "0213", count: 2 },
  { g: "0231", count: 2 },
  { g: "0312", count: 2 },
  { g: "0321", count: 2 },

  { g: "1023", count: 2 },
  { g: "1032", count: 3 },
  { g: "1203", count: 2 },
  { g: "1230", count: 4 },
  { g: "1302", count: 2 },
  { g: "1320", count: 2 },

  { g: "2013", count: 2 },
  { g: "2031", count: 4 },
  { g: "2103", count: 2 },
  { g: "2130", count: 2 },
  { g: "2301", count: 4 },
  { g: "2310", count: 4 },

  { g: "3012", count: 2 },
  { g: "3021", count: 2 },
  { g: "3102", count: 2 },
  { g: "3120", count: 2 },
  { g: "3201", count: 4 },
  { g: "3210", count: 3 },
];

if (cards.map((e) => e.count).reduce((acc, v) => acc + v) !== 60) throw Error();

const DIR = Object.freeze({
  LEFT: 0,
  BOTTOM: 1,
  RIGHT: 2,
  TOP: 3,
});

const connectors = [
  {
    x: circleSize / 2,
    y: (size * 2) / 3,
    cx: controlSize,
    cy: 0,
    prev: -2,
    dir: DIR.LEFT,
  },
  {
    x: (size * 2) / 3,
    y: size - circleSize / 2,
    cx: 0,
    cy: -controlSize,
    prev: 70,
    dir: DIR.BOTTOM,
  },
  {
    x: size - circleSize / 2,
    y: size / 3,
    cx: -controlSize,
    cy: 0,
    prev: 10,
    dir: DIR.RIGHT,
  },
  {
    x: size / 3,
    y: circleSize / 2,
    cx: 0,
    cy: controlSize,
    prev: -62,
    dir: DIR.TOP,
  },
  {
    x: circleSize / 2,
    y: size / 3,
    cx: controlSize,
    cy: 0,
    next: -10,
    dir: DIR.LEFT,
  },
  {
    x: size / 3,
    y: size - circleSize / 2,
    cx: 0,
    cy: -controlSize,
    next: 62,
    dir: DIR.BOTTOM,
  },
  {
    x: size - circleSize / 2,
    y: (size * 2) / 3,
    cx: -controlSize,
    cy: 0,
    next: 2,
    dir: DIR.RIGHT,
  },
  {
    x: (size * 2) / 3,
    y: circleSize / 2,
    cx: 0,
    cy: controlSize,
    next: -70,
    dir: DIR.TOP,
  },
];

const isCenter = (idx = -1, c) =>
  (idx === 26 && c.dir === DIR.RIGHT) ||
  (idx === 27 && c.dir === DIR.LEFT) ||
  (idx === 32 && c.dir === DIR.RIGHT) ||
  (idx === 33 && c.dir === DIR.LEFT) ||
  (idx === 19 && c.dir === DIR.BOTTOM) ||
  (idx === 20 && c.dir === DIR.BOTTOM) ||
  (idx === 39 && c.dir === DIR.TOP) ||
  (idx === 40 && c.dir === DIR.TOP);

const isBoundary = (x = -1, y = -1, idx = -1, c) =>
  (x === 0 && c.dir === DIR.LEFT) ||
  (x === 7 && c.dir === DIR.RIGHT) ||
  (y === 0 && c.dir === DIR.TOP) ||
  (y === 7 && c.dir === DIR.BOTTOM) ||
  isCenter(idx, c);

const isStart = (c) => c.prev !== undefined;

const card = (vnode) => ({
  view: (vnode) =>
    g(
      {
        transform: `translate(${vnode.attrs.x * (size + gap) + 15},${
          vnode.attrs.y * (size + gap) + 15
        })`,
      },
      rect({ x: 0, y: 0, width: size, height: size, fill: `gray` }),

      (vnode.attrs.card || "").split("").map((to, from) => [
        path({
          d: `M ${connectors[from].x},${connectors[from].y}
              C ${connectors[from].x + connectors[from].cx},${
            connectors[from].y + connectors[from].cy
          } 
                ${connectors[+to + 4].x + connectors[+to + 4].cx},${
            connectors[+to + 4].y + connectors[+to + 4].cy
          }
                ${connectors[+to + 4].x},${connectors[+to + 4].y}
             `,
          "stroke-width": "2px",
          fill: `none`,
          stroke: `black`,
        }),
      ]),
      !showConnectors
        ? null
        : use((vnode.attrs.x + 8 * vnode.attrs.y) * 8, (base) =>
            connectors.map((c, cnt) =>
              use(
                isBoundary(vnode.attrs.x, vnode.attrs.y, vnode.attrs.idx, c),
                (b) => [
                  circle({
                    cx: c.x,
                    cy: c.y,
                    r: circleSize,
                    fill: b //&& isStart(c) && !isCenter(vnode.attrs.idx, c)
                      ? "blue"
                      : c.next
                      ? "red"
                      : "green",
                    onmouseover: (e) =>
                      b && isStart(c) && !isCenter(vnode.attrs.idx, c)
                        ? (state.selected = cnt + base)
                        : null,
                  }),
                  !showControl
                    ? null
                    : circle({
                        cx: c.x + c.cx,
                        cy: c.y + c.cy,
                        r: circleSize,
                        fill: "blue",
                      }),
                  !showNumbers
                    ? null
                    : [
                        text(
                          {
                            x: c.x - circleSize / 2,
                            y: c.y + circleSize / 2,
                            fill: "white",
                            style: `font:33px;`,
                          },
                          cnt + base
                        ),
                        text(
                          {
                            x: size / 3,
                            y: size / 2,
                            fill: "white",
                          },
                          vnode.attrs.x,
                          " ",
                          vnode.attrs.y
                        ),
                        text(
                          {
                            x: size / 3,
                            y: size / 2 + 15,
                            fill: "white",
                          },
                          (vnode.attrs.x + 8 * vnode.attrs.y) * 8
                        ),
                      ],
                ]
              )
            )
          ),
      text(
        {
          x: size / 3,
          y: size / 2 + 7,
          fill: "white",
        },
        "×"
      )
    ),
});

const state2 = cards.flatMap((e) => range(e.count).map((i) => e.g));
const state = {
  cards: shuffle(state2.slice(0, state2.length)),
  selected: 384,
  fields: [],
  path: [384],
};

state.fields = range(8)
  .flatMap((j) =>
    range(8).map((i) =>
      i < 3 || i >= 5 || j < 3 || j >= 5
        ? use(
            use(j * 8 + i, (idx) => (idx < 27 ? 0 : idx < 37 ? -2 : -4) + idx),
            (cIdx) => ({
              i,
              j,
              cardIdx: cIdx,
              card: state.cards[cIdx],
            })
          )
        : null
    )
  )
  .filter((e) => !!e);

console.log(state.fields);

m.mount(document.body, {
  view: (vnode) => [
    div("Water "),
    svg(
      {
        width: innerWidth,
        height: innerHeight,
      },
      text(
        { x: innerWidth / 2 - 100, y: innerHeight / 2, fill: "white" },
        JSON.stringify(state.selected)
      ),
      state.fields.map((c) =>
        m(card, {
          x: c.i,
          y: c.j,
          idx: c.cardIdx,
          card: c.card,
        })
      )
    ),
  ],
});
