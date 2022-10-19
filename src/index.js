//import "./style.css";
//import "./sass/main.scss";
//import * as bootstrap from "bootstrap";
//import data from "../json/combinedData_inst.json";
import LazyLoad from "vanilla-lazyload";

import labelsData from "../json/st_labelsData.json";
import objectsData from "../json/st_objectsData.json";

import logo from "./img/c80_logo_blanco.svg";
import html from "./index.html";

//React components
import RenderCartelModal from "./components/CartelModal";

//console.log(process.env);

async function getCarteles() {
  const response = await fetch(
    "https://archivocarteles.c80.cl/data/combinedData_inst.json",
    {
      method: "GET",
      headers: { Accept: "application/json" },
    }
  );

  const data = await response.json();
  loadDom(data.slice(0, perpage));
}

getCarteles();

// async function getCartelesData(url = "", data = {}) {
//   const response = await fetch(url, {
//     mode: "no-cors",
//     headers: { "Content-Type": "application/json" },
//   });
// }

// getCartelesData(
//   "https://archivocarteles.c80.cl/data/combinedData_inst.json",
//   {}
// ).then((data) => {
//   console.log(data);
// });

//console.log(data);

//console.log(data);
let cartelesLazyLoad = new LazyLoad({
  callback_loaded: (el) => {
    el.parentNode.classList.add("loaded");
  },
  callback_error: (el) => {
    el.classList.add("hidden");
  },
});

let dataLabels = new Set();
let dataObjects = new Set();
let dataWords = new Array();
let filteredData = new Array();

let perpage = 20;
let pagenumber = 0;

let loadLock = false;
let modalOpen = false;

const c80Logo = new Image();
c80Logo.src = logo;

//console.log(labelsData, objectsData);

const $grid = document.querySelector(".grid");
const $header = document.getElementById("site-header");
const $headerPresentation = document.querySelector(".description-header");
const headerHeight = $header.offsetHeight;
//console.log($header.offsetHeight);
const $modal = document.querySelector("#react-modal-data");
const $overlay = document.querySelector(".loading");
const $loading = document.querySelector(".loading p");
// const $labelFilters = document.querySelector(".filters--labels select");
// const $objectFilters = document.querySelector(".filters--objects select");
// const $wordFilters = document.querySelector(".filters--words input");
const $etiquetasPlace = document.getElementById("etiquetas-select");
const $objectsPlace = document.getElementById("objetos-select");
const $titlePlace = document.getElementById("resultados-titulo");
const $searchForm = document.getElementById("search-words-form");
const $searchInput = document.getElementById("search-words");
const $etiquetasSelect = document.querySelector("#etiquetas-select");
const $objectsSelect = document.querySelector("#objetos-select");

//$headerPresentation.prepend(c80Logo);

let COUNT = 0;
// let magicGrid = new MagicGrid({
//   container: ".grid",
//   items: perpage * 2,
//   animate: true,
//   useTransform: false,
// });

// magicGrid.listen();
// //magicGrid.positionItems();

let brokenUrls = [];

const unescapeString = (str) => {
  return str.replace(/-/gi, " ").replace(/\+/gi, "&");
};

const escapeString = (str) => {
  return str.trim().replace(/ /gi, "-").replace(/&/gi, "+").toLowerCase();
};

const loadImgEl = (url, wrapper, i) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.setAttribute("class", "lazy img-cartel");
    img.setAttribute("data-src", url);
    //img.setAttribute("data-lazy-function", "rearrange");
    resolve({ img: img, wrapper: wrapper });
    //magicGrid.positionItems();
  });
};

const initData = () => {
  //Iterate first all for the lists
  // data.forEach((d, i) => {
  //   d.labels.forEach((a) => {
  //     dataLabels.add(a);
  //   });
  //   d.objects.forEach((a) => {
  //     dataObjects.add(a);
  //   });
  //   d.words.split(/[\n\r\s]/).forEach((a) => {
  //     dataWords.push(a);
  //   });
  // });
  //console.log(dataLabels, dataObjects, dataWords);
  initFilters();
};

const initFilters = () => {
  Array.from(labelsData).map((label, idx) => {
    $etiquetasPlace.innerHTML += `<option value="${label.itemValue}">${label.itemTitle} (${label.itemOcurrences})</option>`;
  });

  Array.from(objectsData).map((object, idx) => {
    $objectsPlace.innerHTML += `<option value="${object.itemValue}">${object.itemTitle} (${object.itemOcurrences})</option>`;
  });
};

const filterSign = (filterItem, filter, translatedItem) => {
  filteredData = [];
  //console.log(label);
  data.map((item, idx) => {
    if (item[filter].indexOf(filterItem) != -1) {
      //console.log(label);
      filteredData.push(item);
    }
  });
  $grid.innerHTML = "";
  let filterLabel = filter == "labels" ? "la etiqueta" : "el objeto";
  $searchInput.value = "";

  resultsTitle(
    `${filteredData.length} imágenes encontradas con ${filterLabel} "${translatedItem}"`
  );

  loadDom(filteredData);
};

const filterWord = (word) => {
  filteredData = [];
  data.map((item, idx) => {
    let wordRef = item.words.toLowerCase();
    let searchWord = word.toLowerCase();
    if (wordRef.match(searchWord)) {
      filteredData.push(item);
    }
  });
  $grid.innerHTML = "";
  $objectsSelect.selectedIndex = 0;
  $etiquetasSelect.selectedIndex = 0;
  resultsTitle(`${filteredData.length}: ${word}`);
  loadDom(filteredData);
};

const resultsTitle = (title) => {
  $titlePlace.innerHTML = `<h6>${title}</h6>`;
};

const loadDom = (data) => {
  let imagePromises = [];

  // ~~~~~~~~~~~~ GET DATA in Range ~~~~~~~~~~~~
  data.forEach((d, i) => {
    let wrapper = document.createElement("div");
    let localLabels = [];
    let localObjects = [];
    let localWords = [];
    wrapper.classList.add("item");

    d.labels.forEach((a) => {
      //labels.add(a);
      localLabels.push(a);
    });
    d.objects.forEach((a) => {
      //objects.add(a);
      localObjects.push(a);
    });
    d.words.split(/[\n\r\s]/).forEach((a) => {
      //words.add(a);
      localWords.push(a);
    });

    let postDate = new Date(d.date * 1000);

    wrapper.setAttribute("data-labels", Array.from(localLabels).join(", "));
    wrapper.setAttribute("data-objects", Array.from(localObjects).join(", "));
    wrapper.setAttribute("data-words", Array.from(localWords).join(", "));
    wrapper.setAttribute(
      "data-date",
      `${postDate.getDate()}/${
        postDate.getMonth() + 1
      }/${postDate.getFullYear()}`
    );
    wrapper.setAttribute("data-shortcode", d.shortcode);

    if (d.comments.length > 0) {
      //console.log(d.comments);
      let comments_content = [];
      let comments_text = d.comments.map((comment) => {
        comments_content.push(`"@${comment.owner.username} - ${comment.text}"`);
      });
      wrapper.setAttribute("data-comments", `${comments_content.join(";")}`);
    }

    let url = d.url;
    let imgp = loadImgEl(url, wrapper, i);
    imagePromises.push(imgp);
  });

  // ~~~~~~~~~~~~ LOAD ALL IMAGES AND INIT ISO ~~~~~~~~~~~~
  Promise.allSettled(imagePromises).then((results) => {
    let res = results.filter((r) => r.status === "fulfilled");

    res.forEach((r) => {
      r.value.wrapper.appendChild(r.value.img);
      $grid.appendChild(r.value.wrapper);
    });

    cartelesLazyLoad.update();
    //magicGrid.positionItems();
    loadLock = false;
  });
};

//Scroll event listener
const $wrapper = document.querySelector(".wrapper-carteles");

window.addEventListener(
  "scroll",
  (event) => {
    // handle scroll event
    let y = window.scrollY + 780;
    let loadHeight = $grid.offsetHeight;
    let loadTrigger = $wrapper.scrollTop + $wrapper.offsetHeight;
    //console.log(loadHeight, loadTrigger, loadLock);

    //console.log(loadLock == false, y, loadHeight);

    if (loadLock == false && loadTrigger >= loadHeight) {
      pagenumber++;
      loadLock = true;
      //console.log("nextpage");
      //console.log(pagenumber * perpage, pagenumber * perpage + perpage);

      if (filteredData.length > 0) {
        loadDom(
          filteredData.slice(
            pagenumber * perpage,
            pagenumber * perpage + perpage
          )
        );
      } else {
        loadDom(
          data.slice(pagenumber * perpage, pagenumber * perpage + perpage)
        );
      }
    }
  },
  { passive: true }
);

initData();

//searcher

$searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log($searchInput.value);
  filterWord($searchInput.value);
});

document.addEventListener("click", function (e) {
  //console.log(e.target.parentNode);
  let parent = e.target.parentNode;
  let objectsarr_es = new Set();
  let labelsarr_es = new Set();

  if (e.target && parent.classList.contains("item")) {
    //console.log("clickity");
    let currentLabels = parent.getAttribute("data-labels").split(", ");
    let currentLabels_es = currentLabels.map((curlabel) => {
      //return translatedStringFromArray(label, labelsTable, labelsTableES);
      labelsData.map((label) => {
        if (label.itemValue === curlabel) {
          console.log(curlabel, label.itemValue, label.itemTitle);
          labelsarr_es.add(label.itemTitle);
        }
      });
    });

    let currentObjects = parent.getAttribute("data-objects").split(", ");
    let currentObjects_es = currentObjects.map((curobject) => {
      //return translatedStringFromArray(object, objectsTable, objectsTableES);
      objectsData.map((object) => {
        if (object.itemValue === curobject) {
          objectsarr_es.add(object.itemTitle);
        }
      });
    });

    //console.log(currentLabels_es, currentObjects_es);

    window.currentData = {
      modal: true,
      type: "info",
      image: e.target.getAttribute("src"),
      labels: Array.from(labelsarr_es),
      objects: Array.from(objectsarr_es),
      words: parent.getAttribute("data-words").split(", "),
      comments: parent.getAttribute("data-comments"),
      date: parent.getAttribute("data-date"),
      shortcode: parent.getAttribute("data-shortcode"),
    };

    modalOpen = true;
    console.log(window.currentData);
    RenderCartelModal(window.currentData);
    $modal.classList.remove("-hidden");
    //console.log(JSON.stringify(currentData));
  }

  if (e.target && e.target.className == "btn-close") {
    window.currentData = {};
    RenderCartelModal(window.currentData);
    console.log("close");
    modalOpen = false;
  }

  console.log(e.target.className);
  if (e.target && e.target.className == "about") {
    window.currentData = {};
    console.log("click about");
    RenderCartelModal({ modal: true, type: "about" });
  }

  if (e.target && e.target.classList.contains("archivo-carteles-modal")) {
    window.currentData = {};
    RenderCartelModal(window.currentData);
    modalOpen = false;
  }

  if (e.target && e.target.className == "filter-label") {
    let filterData = e.target.getAttribute("data-label");
    //console.log(filterData);
    filterSign(filterData, "labels");
    console.log(filteredData);
  }

  if (e.target && e.target.className == "filter-object") {
    let filterData = e.target.getAttribute("data-object");
    //console.log(filterData);
    filterSign(filterData, "objects");
    console.log(filteredData);
  }
});

//Select event listeners

$etiquetasSelect.addEventListener("change", function (e) {
  let translatedItem =
    $etiquetasSelect.options[$etiquetasSelect.selectedIndex].text;
  filterSign(e.target.value, "labels", translatedItem);
  $objectsSelect.selectedIndex = 0;
});

$objectsSelect.addEventListener("change", function (e) {
  let translatedItem =
    $objectsSelect.options[$objectsSelect.selectedIndex].text;
  filterSign(e.target.value, "objects", translatedItem);
  $etiquetasSelect.selectedIndex = 0;
});

//loadDom(data.slice(0, perpage));
