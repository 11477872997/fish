const dayjs = require('dayjs');
require('dayjs/locale/zh-cn');
const { HolidayUtil, Solar } = require('lunar-typescript');
dayjs.locale('zh-cn');
// icon: '🏮',  图标
// name: '春节', 节日名称
// days: '',  倒计时，
// aFewDaysOff： 放假几天 
// compensatoryLeaveDate：调休日期
let template = [
  {
    icon: '🏮',
    name: '春节',
    days: '',
    aFewDaysOff:'',
    compensatoryLeaveDate:[] 
  },
  {
    icon: '🦄',
    name: '清明节',
    days: '',
    aFewDaysOff:'',
    compensatoryLeaveDate:[]
  },
  {
    icon: '💖',
    name: '劳动节',
    days: '',
    aFewDaysOff:'',
    compensatoryLeaveDate:[]
  },
  {
    icon: '🐟',
    name: '端午节',
    days: '',
    aFewDaysOff:'',
    compensatoryLeaveDate:[]
  },
  {
    icon: '🍁',
    name: '中秋节',
    days: '',
    aFewDaysOff:'',
    compensatoryLeaveDate:[]
  },
  {
    icon: '🏮',
    name: '国庆节',
    days: '',
    aFewDaysOff:'',
    compensatoryLeaveDate:[]
  },
  {
    icon: '🏮',
    name: '元旦节',
    days: '',
    aFewDaysOff:'',
    compensatoryLeaveDate:[]
  },
]

//  摸鱼提示
let getFishingTips = function()  {
  let solar = Solar.fromDate(new Date());
  const year = dayjs().year();
  // 获取调休
  let  holidays = HolidayUtil.getHolidays(year);
  let  list = getMakeshiftShifts(holidays);
   handleMakeUpShifts(list,template);
  let counter = 6;
  let arr = [];
  const today = dayjs().startOf('day');
  const todayText = today.format('YYYY-MM-DD dddd');
  const todays = dayjs().day();
  const weekDays = 5 - todays; 
const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
for (let i = 1; i < counter; i++) {
  let objs = nextLongHoliday(solar, i);
    for (const key of template) {
      if (key.name == objs.name) {
        arr.push({
          icon: key.icon,
          name: key.name,
          days: objs.days,
          aFewDaysOff:key.aFewDaysOff,
          compensatoryLeaveDate:key.compensatoryLeaveDate
        })
      }
    }
  }
  console.log('arr',template)
  let touchTheFish = `
  【摸鱼办】提醒您：\n
🍁今天是${todayText}\n
👨‍💻你好,摸鱼人,钱是老板的,但命是自己的!\n`
touchTheFish += `\n`;
if(weekDay[todays] === '周日'){
  touchTheFish += `🛌休息,明天周一\n`;
}else{
  if(weekDay[todays] !== '周六'){
    if (weekDays === 0) {
      touchTheFish += `🛌周末(大周)下班就放假\n`;
    } else {
      touchTheFish += `🎮距离周末(大周)还有:${weekDays}天\n`;
    }
  }
  if ((weekDays + 1) === 1) {
    touchTheFish += `🛌周末(小周)下班就放假\n`;
  } else {
    touchTheFish += `🕹️距离周末(小周)还有:${weekDays + 1}天\n`;
  } 
  
}
  touchTheFish += `\n`;
  arr.forEach(element => {
    let ab = `${element.icon}距离${element.name}还有${element.days}天(${element.aFewDaysOff})\n`;
    const compensatoryLeaveDateLength = element.compensatoryLeaveDate.length;
    if (compensatoryLeaveDateLength > 0) {
      ab += `😫补班:`;
      for (let i = 0; i < compensatoryLeaveDateLength; i++) {
        ab += `${element.compensatoryLeaveDate[i]}`;
        if (i !== element.compensatoryLeaveDate.length - 1) {
          ab += ",";
        }
      }
      ab += `\n`;
    }
    ab += `\n`;
    touchTheFish += ab;
  });
  return touchTheFish
}

// 获取节假日
let nextLongHoliday = function (d, skip) {
  var name = null;
  var i = 0;
  var skiped = 0;
  var max = 400;
  while (--max > 0) {
    var h = HolidayUtil.getHoliday(d.toYmd());
    if (h) {
      if (!h.isWork()) {
        name = h.getName();
        if (skiped >= skip) {
          break;
        }
      }
    } else {
      if (name) {
        skiped++;
      }
      name = null;
    }
    d = d.next(1);
    i++;
  }
  return { days: i - 1, name: name };
};
// 获取补班和放假总数
const getMakeshiftShifts = (arr)=>{
  // 获取节日
  let newArr = JSON.parse(JSON.stringify(arr));
  let arrFestival = newArr.map((item) =>item._name);
  let deduplication = new Set(arrFestival);
  let reust = [];
  deduplication.forEach(element => {
      let compensatoryLeaveDate = [];
      let aFewDaysOff = [];
      for(let item of arr){
          if(element === item._name && item._work){
              compensatoryLeaveDate.push(item);
          }else if(element === item._name && !item._work){
              aFewDaysOff.push(item);
          }
      }
      reust.push({
          compensatoryLeaveDate:compensatoryLeaveDate,
          aFewDaysOff:aFewDaysOff,
          name:element
      })
  });
  return reust;
}
// 处理补班
const handleMakeUpShifts = (newarr,list)=>{
  for (let i = 0; i < list.length; i++) {
    for (const key of newarr) {
      if (list[i].name === key.name) {
        list[i].aFewDaysOff = key.aFewDaysOff.length;
        if (key.compensatoryLeaveDate.length > 0) {
          key.compensatoryLeaveDate.forEach((k) => {
            list[i].compensatoryLeaveDate.push(k._day.slice(5));
          });
        }
        list[i].compensatoryLeaveDate = Array.from(new Set(list[i].compensatoryLeaveDate)); // 去重
      }
    }
  }
}

module.exports = {getFishingTips}
