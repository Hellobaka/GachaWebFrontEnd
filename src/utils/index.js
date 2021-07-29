/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

import pako from 'pako'
export function GzipUnZip(b64Data) {
  var strData = atob(b64Data, 'base64')
  // Convert binary string to character-number array
  var charData = strData.split('').map(function(x) { return x.charCodeAt(0) })
  // Turn number array into byte-array
  var binData = new Uint8Array(charData)
  // unzip
  var data = pako.inflate(binData)
  // Convert g-unzipped byteArray back to ascii string:
  // strData = String.fromCharCode.apply(null, new Uint16Array(data))
  strData = Utf8ArrayToStr(data)
  return unescape(strData)
}

function Utf8ArrayToStr(array) { // 数据流转化为字符串, 兼容汉字
  var out = ''; var i = 0; var len = array.length; var char1; var char2; var char3; var char4
  while (i < len) {
    char1 = array[i++]
    // 当单个字节时, 最大值 '01111111', 最小值 '00000000' 右移四位 07, 00
    // 当两个字节时, 最大值 '11011111', 最小值 '11000000' 右移四位 13, 12
    // 当三个字节时, 最大值 '11101111', 最小值 '11100000' 右移四位 14, 14
    if (char1 >> 4 <= 7) {
      out += String.fromCharCode(char1)
    } else if (char1 >> 4 === 12 || char1 >> 4 === 13) {
      char2 = array[i++]
      out += String.fromCharCode(((char1 & 0x1F) << 6) | (char2 & 0x3F))
    } else if (char1 >> 4 === 14) {
      char2 = array[i++]
      char3 = array[i++]
      char4 = ((char1 & 0x0F) << 12) | ((char2 & 0x3F) << 6)
      out += String.fromCharCode(char4 | ((char3 & 0x3F) << 0))
    }
  }
  return out
}
