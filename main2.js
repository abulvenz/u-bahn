import m from "mithril";
import tagl, { s } from "tagl-mithril";

const { div, svg, g, path, rect, text, circle } = tagl(m);
const { trunc, random } = Math;
// Konventionen:

// < 0
// ^ 1
// > 2
// v 3

// Der erste Anschluss hat 4 Möglichkeiten
// Der zweite 3
// Der dritte 2
// Der vierte 1

// 0123  0 00000  2
// 0132  1 00001  2
// 0213  2 00010  2
// 0231  3 00011  2
// 0312  4 00100  2
// 0321  5 00101  2

// 1023  6 00110  2
// 1032  7 00111  3
// 1203  8 01000  2
// 1230  9 01001  4
// 1302 10 01010  2
// 1320 11 01011  2

// 2013 12 01100  2
// 2031 13 01101  4
// 2103 14 01110  2
// 2130 15 01111  2
// 2301 16 10000  4
// 2310 17 10001  4

// 3012 18 10010  2
// 3021 19 10011  2
// 3102 20 10100  2
// 3120 21 10101  2
// 3201 22 10110  4
// 3210 23 10111  3

// 8 * 8 = 64 - 4 = 60 Felder

// 0 1 2 3

// 1 0 0 0  0
// 0 1 0 0  1
// 0 0 1 0  2
// 0 0 0 1  3

// 3 2 1 0

// 0 0 0 1  0
// 0 0 1 0  1
// 0 1 0 0  2
// 1 0 0 0  3

// 2 3 1 0

// 0 0 1 0  0
// 0 0 0 1  1
// 0 1 0 0  2
// 1 0 0 0  3

const cards = [
  // 0123  0 00000  2
  { g: "0123", n: 0, b: "00000", count: 2 },
  // 0132  1 00001  2
  { g: "0132", n: 1, b: "00001", count: 2 },
  // 0213  2 00010  2
  { g: "0213", n: 2, b: "00010", count: 2 },
  // 0231  3 00011  2
  { g: "0231", n: 3, b: "00011", count: 2 },
  // 0312  4 00100  2
  { g: "0312", n: 4, b: "00100", count: 2 },
  // 0321  5 00101  2
  { g: "0321", n: 5, b: "00101", count: 2 },

  // 1023  6 00110  2
  { g: "1023", n: 6, b: "00110", count: 2 },
  // 1032  7 00111  3
  { g: "1032", n: 7, b: "00111", count: 3 },
  // 1203  8 01000  2
  { g: "1203", n: 8, b: "01000", count: 2 },
  // 1230  9 01001  4
  { g: "1230", n: 9, b: "01001", count: 4 },
  // 1302 10 01010  2
  { g: "1302", n: 10, b: "01010", count: 2 },
  // 1320 11 01011  2
  { g: "1320", n: 11, b: "01011", count: 2 },

  // 2013 12 01100  2
  { g: "2013", n: 12, b: "01100", count: 2 },
  // 2031 13 01101  4
  { g: "2031", n: 13, b: "01101", count: 4 },
  // 2103 14 01110  2
  { g: "2103", n: 14, b: "01110", count: 2 },
  // 2130 15 01111  2
  { g: "2130", n: 15, b: "01111", count: 2 },
  // 2301 16 10000  4
  { g: "2301", n: 16, b: "10000", count: 4 },
  // 2310 17 10001  4
  { g: "2310", n: 17, b: "10001", count: 4 },

  // 3012 18 10010  2
  { g: "3012", n: 18, b: "10010", count: 2 },
  // 3021 19 10011  2
  { g: "3021", n: 19, b: "10011", count: 2 },
  // 3102 20 10100  2
  { g: "3102", n: 20, b: "10100", count: 2 },
  // 3120 21 10101  2
  { g: "3120", n: 21, b: "10101", count: 2 },
  // 3201 22 10110  4
  { g: "3201", n: 22, b: "10110", count: 4 },
  // 3210 23 10111  3
  { g: "3210", n: 23, b: "10111", count: 3 },
];

if (cards.map((e) => e.count).reduce((acc, v) => acc + v) !== 60) throw Error();

const range = (N, r = []) => (N === 0 ? r : range(N - 1, [...r, r.length]));
const use = (v, f) => f(v);
const size = innerWidth / 10;

const circleSize = size / 20;

const controlSize = size / 4;
const gap = 12;

const showConnectors = true;
const showControl = false;
const showNumbers = false;

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
    cnt: 0,
    prev: -2,
    dir: DIR.LEFT,
  },
  {
    x: (size * 2) / 3,
    y: size - circleSize / 2,
    cx: 0,
    cy: -controlSize,
    cnt: 1,
    prev: 70,
    dir: DIR.BOTTOM,
  },
  {
    x: size - circleSize / 2,
    y: size / 3,
    cx: -controlSize,
    cy: 0,
    cnt: 2,
    prev: 10,
    dir: DIR.RIGHT,
  },
  {
    x: size / 3,
    y: circleSize / 2,
    cx: 0,
    cy: controlSize,
    cnt: 3,
    prev: -62,
    dir: DIR.TOP,
  },
  {
    x: circleSize / 2,
    y: size / 3,
    cx: controlSize,
    cy: 0,
    cnt: 4,
    next: -10,
    dir: DIR.LEFT,
  },
  {
    x: size / 3,
    y: size - circleSize / 2,
    cx: 0,
    cy: -controlSize,
    cnt: 5,
    next: 62,
    dir: DIR.BOTTOM,
  },
  {
    x: size - circleSize / 2,
    y: (size * 2) / 3,
    cx: -controlSize,
    cy: 0,
    cnt: 6,
    next: 2,
    dir: DIR.RIGHT,
  },
  {
    x: (size * 2) / 3,
    y: circleSize / 2,
    cx: 0,
    cy: controlSize,
    cnt: 7,
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
        // text(
        //   { x: connectors[from].x, y: connectors[from].y, fill: "red" },
        //   `${from}->${to}`
        // ),
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
            connectors.map((c) =>
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
                        ? (state.selected = c.cnt + base)
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
                          c.cnt + base
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
        //   vnode.attrs.x + vnode.attrs.y * 8
        //   vnode.attrs.idx,
        " "
        //    vnode.attrs.card
      )
    ),
});

console.log(range(5));

const randomElementIndex = (arr) => trunc(random() * arr.length);
const without = (arr, idx) => arr.filter((e, i) => i !== idx);

const shuffle = (arr, result = []) =>
  arr.length === 0
    ? result
    : use(randomElementIndex(arr), (next) =>
        shuffle(without(arr, next), [...result, arr[next]])
      );

const state2 = cards.flatMap((e) => range(e.count).map((i) => e.g));
const state = { cards: shuffle(state2.slice(0, state2.length)), selected: -1 };
console.log(state);

console.log(state);
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
      range(8).map((j) =>
        range(8).map((i) =>
          i < 3 || i >= 5 || j < 3 || j >= 5
            ? use(
                use(
                  j * 8 + i,
                  (idx) => (idx < 27 ? 0 : idx < 37 ? -2 : -4) + idx
                ),
                (idx) =>
                  m(card, {
                    x: i,
                    y: j,
                    idx,
                    card: state.cards[idx],
                  })
              )
            : null
        )
      )
    ),
  ],
});
