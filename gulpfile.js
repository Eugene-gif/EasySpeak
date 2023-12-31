let preprocessor = "scss"; // Выбор препроцессора в проекте

const { src, dest, watch, series, parallel } = require("gulp");

// Плагины
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const notify = require("gulp-notify");
const fileInclude = require("gulp-file-include");
const htmlMin = require("gulp-htmlmin");
const imageMin = require("gulp-imagemin");
const newer = require("gulp-newer");
const webp = require("gulp-webp");
const webpHtml = require("gulp-webp-html");
const webpCss = require("gulp-webp-css");
const sass = require("gulp-sass")(require("sass"));
const babel = require("gulp-babel");
const webpack = require("webpack-stream");
// const jquery = require("jquery");
const scss = require("gulp-sass")(require("sass"));
const less = require("gulp-less");
const size = require("gulp-size");
const svgSprite = require("gulp-svg-sprite");
// const ttf2woff = require("gulp-ttf2woff");
// const ttf2woff2 = require("gulp-ttf2woff2");
const cleancss = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const del = require("del");

// __________ Обработка HTML __________
const html = () => {
  return (
    src("./src/html/*.html")
      .pipe(
        plumber({
          errorHandler: notify.onError((error) => ({
            title: "HTML",
            message: error.message,
          })),
        })
      )
      .pipe(fileInclude())
      .pipe(webpHtml()) // Отключать без использования оптимизации
      .pipe(size({ title: "До сжатия" }))
      // Отключать для многостраничности
      // .pipe(concat("index.html"))
      .pipe(
        htmlMin({
          collapseWhitespace: true,
        })
      )
      .pipe(size({ title: "После сжатия" }))
      .pipe(dest("./dist"))
      .pipe(browserSync.stream())
  );
};

// __________ Обработка CSS __________
const styles = () => {
  return src("./src/styles/**/*." + preprocessor)
    .pipe(sourcemaps.init())
    .pipe(
      sass.sync().on(
        "error",
        notify.onError((error) => ({
          title: "CSS",
          message: error.message,
        }))
      )
    )
    .pipe(webpCss()) // Отрубать без оптимизации картинок
    .pipe(autoprefixer())
    .pipe(fileInclude())
    .pipe(size({ title: "До сжатия" }))
    .pipe(concat("style.min.css"))
    .pipe(cleancss())
    .pipe(size({ title: "После сжатия" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest("./dist/css"))
    .pipe(browserSync.stream());
};

// __________ Обработка JS __________
const scripts = () => {
  return (
    src([
      "src/js/**/*.js",
      //  "node_modules/slick-carousel/slick/slick.js",
      //  "node_modules/jquery/dist/jquery.js"
    ])
      .pipe(sourcemaps.init())
      .pipe(
        plumber({
          errorHandler: notify.onError((error) => ({
            title: "JS",
            message: error.message,
          })),
        })
      )
      // .pipe(jquery())
      .pipe(babel())
      .pipe(
        webpack({
          mode: "production",
        })
      )
      .pipe(sourcemaps.write("."))
      .pipe(dest("./dist/js"))
      .pipe(browserSync.stream())
  );
};

// __________ Обработка с оптимизацией картинок __________
const images = () => {
  return src([
    // Все пути со вложенностями
    "./src/img/**/*.jpg",
    "./src/img/**/*.png",
    "./src/img/**/*.jpeg",
    "./src/img/**/*.gif",
    "./src/img/**/*.webp",
    "./src/img/**.jpg",
    "./src/img/**.png",
    "./src/img/**.jpeg",
    "./src/img/**.gif",
    "./src/img/**.webp",
    "!./src/img/**.svg",
    "!./src/img/favicon/**.png",
  ])
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: "Img",
          message: error.message,
        })),
      })
    )
    .pipe(newer("./dist/img"))
    .pipe(
      imageMin({
        optimizationLevel: 2,
        progressive: true,
        interlaced: true,
        verbose: true,
      })
    )
    .pipe(
      webp({
        quality: 80,
      })
    )
    .pipe(dest("./dist/img"));
};

// __________ Создание svg-спрайтов __________
const svgSprites = () => {
  return src("./src/img/sprite/**.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest("./dist/img/"));
};

// __________ Папка с ресурсами __________
const resources = () => {
  return src("./src/resources/**").pipe(dest("./dist/resources"));
};

// __________ Папка с svg __________
const svg = () => {
  return src("./src/img/svg/**").pipe(dest("./dist/img/svg"));
};

// __________ Фавиконка __________
const favicon = () => {
  return src(["./src/*.ico", "./src/*.webmanifest"]).pipe(dest("./dist/"));
};
const faviconPng = () => {
  return src("./src/img/favicon/*.png").pipe(dest("./dist/img/favicon/"));
};

// __________ Удаление директории __________
const clear = () => {
  return del("./dist");
};

// __________ Сервер __________
const server = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
};

// __________ Наблюдатель __________
const watcher = () => {
  watch("./src/html/**/*.html", html);
  watch("./src/styles/**/*." + preprocessor, styles);
  watch("./src/js/**/*.js", scripts);
  watch(
    [
      "./src/img/**/*.jpg",
      "./src/img/**/*.png",
      "./src/img/**/*.jpeg",
      "./src/img/**/*.gif",
      "./src/img/**/*.webp",
      "./src/img/**.jpg",
      "./src/img/**.png",
      "./src/img/**.jpeg",
      "./src/img/**.gif",
      "./src/img/**.webp",
      "./src/img/**.svg",
    ],
    images
  );
  watch("./src/img/sprite/**.svg", svgSprites);
  watch(["./src/*.ico", "./src/*.webmanifest"], favicon);
  watch("./src/resources/**", resources);
  watch("./src/img/svg/**", svg);
  // watch('./src/fonts/**.ttf', fonts);
};

// Задачи
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watcher;
exports.server = server;
exports.clear = clear;
exports.images = images;
exports.svgSprites = svgSprites;
exports.svg = svg;

// Сборка
exports.default = series(
  clear,
  parallel(
    html,
    /*fonts,*/ styles,
    scripts,
    images,
    svgSprites,
    svg,
    favicon,
    faviconPng,
    resources
  ),
  parallel(watcher, server)
);
