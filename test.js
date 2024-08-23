// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

const secret_key =
  '14a35723cdb5ac7e2f96f97e043ece0d3eceae5ae1b650e75c69825a7077600d';

const items = [
  {
    merchant_id: '13aea9ea-f5e3-4a38-85c3-a89b79b9e604',
    service_id: '8a42bd96-56ff-4ed4-854c-a9996cc6c8ba',
    merchant_name: 'ИП Iris',
    name: 'Товар 1',
    quantity: 1,
    amount_one_pcs: 1,
    amount_sum: 1,
  },
];
const data = {
  amount: 1,
  currency: 'KZT',
  order_id: 'order_id_1',
  description: 'description_1',
  payment_type: 'pay',
  payment_method: 'ecom',
  items: items,
  email: 'medcod49@gmail.com',
  payment_lifetime: 36000,
  callback_url: 'https://api.iris-zoloto.kz/order/callback',
};

// Преобразуем объект в строку JSON
const dataJson = JSON.stringify(data);

// Кодируем строку JSON в base64
const base64Data = Buffer.from(dataJson).toString('base64');

// Генерация HMAC-подписи
const hmac = crypto.createHmac('sha512', secret_key);
hmac.update(base64Data);
const sign = hmac.digest('hex');

// Создаем объект запроса
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const obj = {
  data: base64Data,
  sign: sign,
};

// Выводим результат
// console.log(obj);

// Декодируем данные из base64 в строку JSON
const base64DataRes =
  'eyJwYXltZW50X2lkIjo2MDg0MjM4MTcwODE2OTAzNCwib3JkZXJfaWQiOiJvcmRlcl9pZF8xIiwicGF5bWVudF90eXBlIjoicGF5IiwicGF5bWVudF9tZXRob2QiOiJlY29tIiwicGF5bWVudF9zdGF0dXMiOiJjcmVhdGVkIiwiYW1vdW50IjoxLCJhbW91bnRfaW5pdGlhbCI6MSwiY3VycmVuY3kiOiJLWlQiLCJjYXB0dXJlZF9kZXRhaWxzIjp7fSwiY2FuY2VsX2RldGFpbHMiOnt9LCJjcmVhdGVkX2RhdGUiOiIyMDI0LTA4LTIzIDE3OjM0OjQ1ICswMDAwIiwicGF5ZXJfaW5mbyI6eyJlbWFpbCI6Im1lZGNvZDQ5QGdtYWlsLmNvbSJ9LCJwYXltZW50X3BhZ2VfdXJsIjoiaHR0cHM6Ly9wYXltZW50LXBhZ2Uub25ldmlzaW9ucGF5LmNvbS9wcC9wYXltZW50X3BhZ2UvZDFlYjFmOTMtY2U4Ny00MzNmLTk3OTYtOTY3Mzc0NmYzZWY2P2xhbmc9cnUiLCJ3YWxsZXRfaWRlbnRpZmllciI6e319';
const dataJsonRes = Buffer.from(base64DataRes, 'base64').toString('utf8');

// Преобразуем строку JSON обратно в объект
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dataObject = JSON.parse(dataJsonRes);

// console.log(dataObject);

const api_key = '48372ce1-9f56-4000-9b1e-31d6595b08b0';
const api_key_base64 = Buffer.from(api_key).toString('base64');
console.log(api_key_base64);
