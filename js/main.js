let map;
let mapDiv = document.querySelector('#map');
let playerPlacemark;
let cord;
let correctPlacemark;
let line;
let count = 20;
let index1;
let index2;
let index3;
let answerBtn1 = document.querySelector('#answer_btn1');
let answerBtn2 = document.querySelector('#answer_btn2');
let answerBtn3 = document.querySelector('#answer_btn3');
let NextBtn1 =  document.querySelector('#next_btn1');
let NextBtn2 =  document.querySelector('#next_btn2');
let NextBtn3 =  document.querySelector('#next_btn3');
let endGameBtn = document.querySelector('#end_game');
let endGameDiv = document.querySelector('#end_game_div');
let coords= [[56.852193, 53.197024],[56.841303, 53.210554],[56.852524, 53.203740],[56.844021, 53.198533],[56.843931, 53.197480],
[56.846269, 53.219587],[56.849593, 53.205210],[56.853482, 53.216899],[56.804154, 53.165245],[56.844523, 53.191167],
[56.854027, 53.218997],[56.865218, 53.174542],[56.844024, 53.200803],[56.844134, 53.199816],[56.848314, 53.222156],
[56.847002, 53.199951],[56.852095, 53.209237],[56.848681, 53.226688],[56.859733, 53.176518],[56.845734, 53.199521]] //массив координат
let correctCord;
let BeginDiv = document.querySelector('#begin');
let startBtn = document.querySelector('#start_btn');
let distance;
let points;
let centerCoord = [56.84122307807334, 53.21270584106413];
let yourPointsText = document.querySelector('#your_points');
let yourTotalPointsText = document.querySelector('#your_total_points');
let totalPoints = 0;
let YouGuess = document.querySelector('#you_guess');
let pics = document.querySelectorAll('.pic');//создаем массив картинок, выбирая элементы по классу, который указали в HTML
let infoTexts = document.querySelectorAll('.info_text');//создаем массив Текстов, выбирая элементы по классу, который указали в HTML
//ВВОД всех переменных
index1 = Math.floor(Math.random()*count);
index2 = index1;
index3 = index1;
while (index2==index1||index3==index1||index2==index3)
{
  index2 = Math.floor(Math.random()*count);  
  index3 = Math.floor(Math.random()*count); 
}
function PointsFromDistance(x){
  if(x<=50){
   return 5000
  }
  if(x>50){
    if(x<=500){
    return Math.round(5275 - 5.55*x)}
  }
  if (x>500){
       if(x<=1750){
        return Math.round(3200-1.4*x)}
      }
  if (x>1750){
      if(x<3000){
      return Math.round(1800 - 0.6*x)}
    }
  if(x>=3000){ 
   return 0
  }
}
function init()
{ 
  cord = centerCoord;// изначально координаты метки пользователя будут равны координатам центра карты
  mapDiv.classList.remove("display_none"); // добавляем на экран блок, в котором будет наша карта
  map = new ymaps.Map('map', { //создаем новую карту,указвая блок в котором будет находится карта(id нужного блока)
      //описываем свойства карты 
       center: centerCoord, //центр
       zoom: 12.2,//приближение
       controls: ['zoomControl'],//из всех элементов, доступных на картах от Яндекса оставляем только контроллер масштаба
       behaviors: ['drag']//поведение карты, такое, что при прокрутке колеса пользователь прокручивает страницу, а не увеличивает масштаб
    });
    playerPlacemark = new ymaps.Placemark(cord,null,{// cоздаем новую метку, для этого указываем координаты центра и свойства
			draggable: true// в свойствах добавляем draggable, что позволит пользователь двигать метку
		});
    correctCord = coords[index1]//координаты правильной метки берем из массива координат с нужным индексом
    correctPlacemark = new ymaps.Placemark(correctCord,null,{//создаем правильную метку с координатами которые получили в прошлой строке
      iconColor: '#00cc33'//меняем в свойствах цвет, чтобы отличать метки
    },
    {
      draggable: false
     /* preset: 'islands#dotIcon',
      iconColor: '#0095b6'*/
    }
    );
    playerPlacemark.events.add('dragend', function(e){
			 cord = e.get('target').geometry.getCoordinates();})//на событие "dragend"(передвижение) получаем новые координаты
map.geoObjects.add(playerPlacemark);//добавляем на карту метку пользователя
answerBtn1.classList.remove("display_none")//добавляем кнопку "ответ"
BeginDiv.classList.add("display_none")//убираем блок , который был в начале игры
startBtn.classList.add("display_none")//убираем кнопку начать игру
pics[index1].classList.remove("display_none")//добавляем нужную картинку
}

function answerClick(){
  playerPlacemark = new ymaps.Placemark(cord,null,{  
    draggable: false // меняем свойство draggable, чтобы после ответа пользователь не мог больше двигать кнопку
  });
  map.geoObjects.add(playerPlacemark);//добавляем на карту метку пользователя
  map.geoObjects.add(correctPlacemark);//добавляем на карту правильную метку
 line = new ymaps.GeoObject({  // создаем прямую линию между метками для наглядности расстояния
  // Определение типа геометрии" Полилиния".
  geometry: {
     type: "LineString",
      coordinates: [
        correctCord,  cord //координаты краев линии (координаты меток)
      ]
  },
}, {
  // Включение режима отображения в виде геодезических кривых.
 //geodesic: true,
  // Установка ширины до 5 пикселей.
 strokeWidth: 5,
  // Установка цвета линии.
strokeColor: "#ff0033aa" // первые 6 цифр- цвет в 16-тиричном коде , последние две - прозрачность в 16-тиричном коде(от 00 до FF)

});
// Добавление геообъекта на карту.
map.geoObjects.add(line);
distance = line.geometry.getDistance();//В переменную  distance запишем растояние линии(оно же-растояние между метками), получим его методом getDistance(), который используют в примере в документации
points = PointsFromDistance(distance);//Получим очки за  при помощи выше написанной функции PointsFromDistance
totalPoints = totalPoints + points;// Суммируем очки за вопрос в переменную totalPoints, которая будет хранить в сеье сумму всех набранных очков,эту переменныую выведем в конце игры 
YouGuess.classList.remove("display_none");//Добавляем заголовок"ты угадывал
infoTexts[index1].classList.remove("display_none");//добавляем текст с информацией о достопримечательности(элемент из массива текстов с нужным индексом)
NextBtn1.classList.remove("display_none");//добавляем кнопку "Далее"
answerBtn1.classList.add("display_none");//убираем кнопку "Ответ"
yourPointsText.textContent = 'Ты набрал ' + points + '/5000 очков';//изменяем текстовое содержание нужного блока, чтобы вывести очки пользователя за данный вопрос}
//console.log(distance)
//console.log(PointsFromDistance(distance))
}
function init2()
{ 
  cord = centerCoord;
    map.destroy();//удаление старой карты
    YouGuess.classList.add("display_none");//удаляем заголовок"ты угадывал
  infoTexts[index1].classList.add("display_none");// удаляемтекст с информацией о достопримечательности(элемент из массива текстов с нужным индексом)
  NextBtn1.classList.add("display_none"); //удаляем кнопку "Далее"
    map = new ymaps.Map('map', {//дале тело функции копирует функцию unit()
        center: centerCoord,
        zoom: 12.2,
        controls: ['zoomControl'],
        behaviors: ['drag'],
      });
      playerPlacemark = new ymaps.Placemark(centerCoord,null,{
        draggable: true
      });
      correctCord = coords[index2]
       correctPlacemark = new ymaps.Placemark(correctCord,null,{
      iconColor: '#00cc33'
    },
    {
      draggable: false
    }
    );
      playerPlacemark.events.add('dragend', function(e){
        cord = e.get('target').geometry.getCoordinates();})
  map.geoObjects.add(playerPlacemark);
  answerBtn1.classList.add("display_none");//убираем ненужную кнопку "ответ"
  pics[index1].classList.add("display_none");//убираем ненужную картинку
  answerBtn2.classList.remove("display_none");//добавляем нужную кнопку "ответ"
  pics[index2].classList.remove("display_none");//добавляем нужную картинку
  yourPointsText.textContent = '';
  window.scrollTo({                //перемещаем пользователя на верх сайта
    top: 0, //указываем координаты точки перемещение, счет идет сверху, то есть top: 0 = самый верх
    behavior: "smooth"//указывем что нужно переместить плавно
  });
  }
  function answerClick2(){
      playerPlacemark = new ymaps.Placemark(cord,null,{
        draggable: false
      });
      map.geoObjects.add(playerPlacemark);
      map.geoObjects.add(correctPlacemark);
    line = new ymaps.GeoObject({
      // Определение типа геометрии" Полилиния".
      geometry: {
        type: "LineString",
          coordinates: [
            correctCord,  cord 
          ]
      },
      // Определение данных геообъекта.
    // properties: {
        
      //}
    }, {
      // Включение режима отображения в виде геодезических кривых.
    geodesic: true,
      // Установка ширины до 5 пикселей.
    strokeWidth: 5,
      // Установка цвета линии.
    strokeColor: "#ff0033aa"
    });
    // Добавление геообъекта на карту.
    // этот код меняет поведение прокрутки на "smooth"

    map.geoObjects.add(line);
    distance = line.geometry.getDistance();
    points = PointsFromDistance(distance);
    totalPoints = totalPoints + points;
    YouGuess.classList.remove("display_none");
    infoTexts[index2].classList.remove("display_none");
    NextBtn2.classList.remove("display_none");
    answerBtn2.classList.add("display_none");
    yourPointsText.textContent = 'Ты набрал ' + points + '/5000 очков';
}
 function init3(){
   cord = centerCoord;
    map.destroy();
    YouGuess.classList.add("display_none");
  infoTexts[index2].classList.add("display_none");
  NextBtn2.classList.add("display_none"); 
    map = new ymaps.Map('map', {
        center: centerCoord,
        zoom: 12.2,
        controls: ['zoomControl'],
        behaviors: ['drag'],
      });
      playerPlacemark = new ymaps.Placemark(centerCoord,null,{
        draggable: true
      });
      correctCord = coords[index3]
      correctPlacemark = new ymaps.Placemark(correctCord,null,{
      /*draggable: false*
      preset: 'islands#dotIcon',*/
      iconColor: '#00cc33'
    },
    {
      draggable: false
     /* preset: 'islands#dotIcon',
      iconColor: '#0095b6'*/
    }
    );
      playerPlacemark.events.add('dragend', function(e){
        cord = e.get('target').geometry.getCoordinates();})
  map.geoObjects.add(playerPlacemark);
  answerBtn2.classList.add("display_none");
  pics[index2].classList.add("display_none");
  answerBtn3.classList.remove("display_none");
  pics[index3].classList.remove("display_none");
  yourPointsText.textContent = '';
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
function answerClick3(){
    playerPlacemark = new ymaps.Placemark(cord,null,{
      draggable: false
    });
    map.geoObjects.add(playerPlacemark);
    map.geoObjects.add(correctPlacemark);
  line = new ymaps.GeoObject({
    // Определение типа геометрии" Полилиния".
    geometry: {
      type: "LineString",
        coordinates: [
          correctCord,  cord 
        ]
    },
  }, {
    // Включение режима отображения в виде геодезических кривых.
  geodesic: true,
    // Установка ширины до 5 пикселей.
  strokeWidth: 5,
    // Установка цвета линии.
  strokeColor: "#ff0033aa"
  });
  // Добавление геообъекта на карту.
  map.geoObjects.add(line);
  distance = line.geometry.getDistance();
  points = PointsFromDistance(distance);
  totalPoints = totalPoints + points;
  YouGuess.classList.remove("display_none");
  infoTexts[index3].classList.remove("display_none");
  endGameBtn.classList.remove("display_none");
  answerBtn3.classList.add("display_none");
  yourPointsText.textContent = 'Ты набрал ' + points + '/5000 очков'
}

function endGameClick(){
  yourPointsText.textContent = '' ;//убираем вывод  очков за предыдущий раунд
  yourTotalPointsText.textContent ='Ты набрал ' + totalPoints + '/15000 очков';// выводим количество очков за всю игру
  map.destroy();//удаляем карту
  endGameDiv.classList.remove("display_none");//добавлем блок, который хотим показать в конце игры
  pics[index3].classList.add("display_none");//убираем картинку
  YouGuess.classList.add("display_none");//убираем заголовок "ты угадывал"
  infoTexts[index3].classList.add("display_none");//убираем текст с информацией
  endGameBtn.classList.add("display_none");// убираем кнопку "завершить игру"
  answerBtn3.classList.add("display_none");//убираем кнопку "ответ"
  mapDiv.classList.add("display_none");//убираем блок, в котором находилась карта
}
function restart(){
  totalPoints = 0;//обнуляем итоговые очки
  yourTotalPointsText.textContent ='';//убираем выводимый в конце игры текст
  endGameDiv.classList.add("display_none");//убираем блок, который показывали в конце игры
  index1 = Math.floor(Math.random()*count);
index2 = index1;
index3 = index1;
while (index2==index1||index3==index1||index2==index3)
{
  index2 = Math.floor(Math.random()*count);  
  index3 = Math.floor(Math.random()*count); 
} // так же генеририруем три  индекса по которым будем брать достопримечательности
  cord = centerCoord;
  mapDiv.classList.remove("display_none"); 
  map = new ymaps.Map('map', {
       center: centerCoord,
       zoom: 12.2,
       controls: ['zoomControl'],
       behaviors: ['drag'],
    });//создаем новую такую же карту
    playerPlacemark = new ymaps.Placemark(centerCoord,null,{
			draggable: true
		});
    correctCord = coords[index1]
     correctPlacemark = new ymaps.Placemark(correctCord,null,{
      iconColor: '#00cc33'
    },
    {
      draggable: false
    }
    );
    playerPlacemark.events.add('dragend', function(e){
			 cord = e.get('target').geometry.getCoordinates();})
map.geoObjects.add(playerPlacemark);
answerBtn1.classList.remove("display_none")
BeginDiv.classList.add("display_none")
startBtn.classList.add("display_none")
pics[index1].classList.remove("display_none")//оставшееся тело функции повторяет тело функции unit
}
