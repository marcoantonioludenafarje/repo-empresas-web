import {dictionary} from './variables';
import IntlMessages from '../@crema/utility/IntlMessages';

export const toEpoch = (strDate) => {
  let someDate = new Date(strDate);
  someDate = someDate.getTime();
  return someDate;
};

export const timestampToISO8601 = (timestamp) => {
  // Crear un objeto de fecha a partir del timestamp
  let fecha = new Date(timestamp);

  // Obtener año, mes y día
  let año = fecha.getFullYear();
  let mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Asegurar que el mes tenga dos dígitos
  let dia = ('0' + fecha.getDate()).slice(-2); // Asegurar que el día tenga dos dígitos

  // Formatear la fecha como YYYY-MM-DD
  let fechaFormateada = año + '-' + mes + '-' + dia;

  return fechaFormateada;
};

export const convertToDate = (miliseconds) => {
  const fecha = new Date(miliseconds);
  const fecha_actual = `${fecha.getDate()}/${
    fecha.getMonth() + 1
  }/${fecha.getFullYear()} - ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
  return fecha_actual;
};

export const toDateWithScript = (miliseconds) => {
  const fecha = new Date(miliseconds);
  const fecha_actual = `${fecha.getDate()}-${
    fecha.getMonth() + 1
  }-${fecha.getFullYear()}   ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
  return fecha_actual;
};

export const convertToDateWithoutTime = (miliseconds) => {
  const fecha = new Date(miliseconds);
  const fecha_actual =
    ('0' + fecha.getDate()).slice(-2) +
    '/' +
    ('0' + (fecha.getMonth() + 1)).slice(-2) +
    '/' +
    fecha.getFullYear();
  return fecha_actual;
};

export const justDate = (date) => {
  const fecha = new Date(date);
  const fecha_actual =
    ('0' + fecha.getDate()).slice(-2) +
    ' - ' +
    ('0' + (fecha.getMonth() + 1)).slice(-2) +
    ' - ' +
    fecha.getFullYear();
  return fecha_actual;
};
export const justTime = (date) => {
  const fecha = new Date(date);
  const tiempo = `${fecha.getHours()} : ${fecha.getMinutes()} : ${fecha.getSeconds()}`;
  return tiempo;
};

export const strDateToDateObject = (strDate) => {
  let date = strDate;
  if (date.includes('-')) {
    date = date.replaceAll('-', '/');
  }
  console.log('date', date);
  let dateSplited = date.split('/');
  console.log('dateSplited', dateSplited);
  let newDate = dateSplited[1] + '/' + dateSplited[0] + '/' + dateSplited[2];
  console.log('newDate', newDate);
  return newDate;
};

export const ISO8601DateToSunatDate = (fechaString) => {
  // Crear un objeto de fecha
  if (typeof fechaString == 'number') {
    fechaString = '';
  }
  console.log('fechastring', fechaString);
  let fecha = fechaString.split('-');

  // Obtener día, mes y año como números
  let dia = parseInt(fecha[2], 10);
  let mes = parseInt(fecha[1], 10);
  let año = parseInt(fecha[0], 10);

  // Asegurar que el día y el mes tengan dos dígitos
  dia = dia < 10 ? '0' + dia : dia.toString();
  mes = mes < 10 ? '0' + mes : mes.toString();

  // Formatear la fecha como DD/MM/YYYY
  let fechaFormateada = dia + '/' + mes + '/' + año;

  return fechaFormateada;
};

export const strDateToDateObject_ES = (strDate) => {
  let date = strDate;
  if (date.includes('-')) {
    date = date.replaceAll('-', '/');
  }
  console.log('date', date);
  let dateSplited = date.split('/');
  console.log('dateSplited', dateSplited);
  let newDate = dateSplited[0] + '/' + dateSplited[1] + '/' + dateSplited[2];
  console.log('newDate', newDate);
  return newDate;
};

export const parseTo3Decimals = (number) => {
  let newValue = number + Number.EPSILON;
  newValue = Math.round(newValue * 1000) / 1000;
  return newValue;
};

export const getActualSimpleDate = () => {
  const date = new Date();
  let result =
    ('0' + date.getDate()).slice(-2) +
    '/' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '/' +
    date.getFullYear();
  return result;
};

export const toDateAndHOurs = (date) => {
  const newDate = new Date(date);
  const resDate =
    ('0' + newDate.getDate()).slice(-2) +
    '-' +
    ('0' + (newDate.getMonth() + 1)).slice(-2) +
    '-' +
    newDate.getFullYear();
  const resTime =
    ('0' + newDate.getHours()).slice(-2) +
    ':' +
    ('0' + (newDate.getMinutes() + 1)).slice(-2) +
    ':' +
    ('0' + (newDate.getSeconds() + 1)).slice(-2);
  return `${resDate} ${resTime}`;
};

export const specialFormatToSunat = (miliseconds) => {
  let date = new Date();
  if (miliseconds) date = new Date(miliseconds);

  let result =
    ('0' + date.getDate()).slice(-2) +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    date.getFullYear();
  return result;
};

export const toSimpleDate = (strDate) => {
  let date = new Date(strDate);
  let result =
    ('0' + date.getDate()).slice(-2) +
    '/' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '/' +
    date.getFullYear();
  return result;
};

export const dateWithHyphen = (miliseconds) => {
  let date = new Date(miliseconds);
  let result =
    ('0' + date.getDate()).slice(-2) +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    date.getFullYear();
  return result;
};

export const convertToDatePretty = (miliseconds) => {
  const fecha = new Date(miliseconds);
  const fecha_actual = `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`;
  return fecha_actual;
};

export const translateValue = (category, value) => {
  // console.log("el dictionary", dictionary);
  return dictionary[category][value];
  // return ''
};

function comparar(a, b) {
  return a - b;
}

export const getInformationGrouped = (arrayMovements) => {
  let transformData = arrayMovements
    .map((item) => {
      let auxiliarDateData = new Date(item.createdAt);
      return {
        ...item,
        month: `${auxiliarDateData.getMonth()}/${auxiliarDateData.getFullYear()}`,
        date: `${auxiliarDateData.getDate()}/${auxiliarDateData.getMonth()}/${auxiliarDateData.getFullYear()}`,
        day: `${auxiliarDateData.getDate()}`,
      };
    })
    .sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

  let masterData = {
    stockResult: [],
    stock: 0,
    ingress: {
      yearlyData: [],
      monthlyData: [],
      info: {
        mediaPricing: 0,
        max: 0,
        min: 0,
      },
    },
    egress: {
      yearlyData: [],
      monthlyData: [],
      info: {
        mediaPricing: 0,
        max: 0,
        min: 0,
      },
    },
  };

  let stockRelativo = 0;
  let sumIngressPrice = 0;
  let sumEgressPrice = 0;

  let maxIngressPrice = transformData.filter(
    (item) => item.movementType == 'OUTPUT',
  )[0]
    ? transformData.filter((item) => item.movementType == 'OUTPUT')[0].priceUnit
    : 0;
  let minIngressPrice = transformData.filter(
    (item) => item.movementType == 'OUTPUT',
  )[0]
    ? transformData.filter((item) => item.movementType == 'OUTPUT')[0].priceUnit
    : 0;
  let maxEgressPrice = transformData.filter(
    (item) => item.movementType == 'INPUT',
  )[0]
    ? transformData.filter((item) => item.movementType == 'INPUT')[0].priceUnit
    : 0;
  let minEgressPrice = transformData.filter(
    (item) => item.movementType == 'INPUT',
  )[0]
    ? transformData.filter((item) => item.movementType == 'INPUT')[0].priceUnit
    : 0;

  let IngressLength = transformData.filter(
    (item) => item.movementType == 'OUTPUT',
  ).length;
  let EgressLength = transformData.filter(
    (item) => item.movementType == 'INPUT',
  ).length;

  arrayMovements.forEach((item) => {
    item.movementType == 'INPUT'
      ? (stockRelativo += item.quantity)
      : (stockRelativo -= item.quantity);
    masterData.stockResult.push({
      name: convertToDatePretty(item.createdAt),
      value: stockRelativo,
    });
    if (item.movementType == 'OUTPUT') {
      masterData.ingress.yearlyData.push({
        month: item.month,
        amount: item.priceUnit,
      });
      masterData.ingress.monthlyData.push({
        date: item.date,
        amount: item.priceUnit,
      });
      sumIngressPrice += item.priceUnit;
      item.priceUnit >= maxIngressPrice
        ? (maxIngressPrice = item.priceUnit)
        : null;
      item.priceUnit <= minIngressPrice
        ? (minIngressPrice = item.priceUnit)
        : null;
    } else {
      masterData.egress.yearlyData.push({
        month: item.month,
        amount: item.priceUnit,
      });
      masterData.egress.monthlyData.push({
        date: item.date,
        amount: item.priceUnit,
      });
      sumEgressPrice += item.priceUnit;
      item.priceUnit >= maxEgressPrice
        ? (maxEgressPrice = item.priceUnit)
        : null;
      item.priceUnit <= minEgressPrice
        ? (minEgressPrice = item.priceUnit)
        : null;
    }
  });
  masterData.stock = stockRelativo;
  masterData.ingress.info.mediaPricing =
    IngressLength > 0 ? (sumIngressPrice / IngressLength).toFixed(2) : 0;
  masterData.egress.info.mediaPricing =
    EgressLength > 0 ? (sumEgressPrice / EgressLength).toFixed(2) : 0;

  masterData.ingress.info.max = maxIngressPrice;
  masterData.ingress.info.min = minIngressPrice;
  masterData.egress.info.min = minEgressPrice;
  masterData.egress.info.max = maxEgressPrice;

  // masterData.ingress.yearlyData = transformData.filter(item=>item.movementType == 'INPUT').map(item =>{
  //   return { month: item.month, amount: item.priceUnit }
  // })
  // masterData.ingress.monthlyData = transformData.filter(item=>item.movementType == 'INPUT').map(item =>{
  //   return { date: item.date, amount: item.priceUnit  }
  // })

  // masterData.egress.yearlyData = transformData.filter(item=>item.movementType == 'OUTPUT').map(item =>{
  //   return { month: item.month, amount: item.priceUnit  }
  // })
  // masterData.egress.monthlyData = transformData.filter(item=>item.movementType == 'OUTPUT').map(item =>{
  //   return { date: item.date, amount: item.priceUnit  }
  // })

  // transformData.filter(item=>item.movementType == 'INPUT').reduce(function(res, value) {
  //   if (!res[value.month]) {
  //     res[value.month] = { month: value.month, amount: 0 };
  //     masterData.ingress.yearlyData.push(res[value.month])
  //   }
  //   res[value.month].amount += value.quantity;
  //   return res;
  // }, {})
  // transformData.filter(item=>item.movementType == 'OUTPUT').reduce(function(res, value) {
  //   if (!res[value.month]) {
  //     res[value.month] = { month: value.month, amount: 0 };
  //     masterData.egress.yearlyData.push(res[value.month])
  //   }
  //   res[value.month].amount += value.quantity;
  //   return res;
  // }, {})

  // transformData.filter(item=>item.movementType == 'INPUT').reduce(function(res, value) {
  //   if (!res[value.date]) {
  //     res[value.date] = { month: value.date, amount: 0 };
  //     masterData.ingress.monthlyData.push(res[value.date])
  //   }
  //   res[value.date].amount += value.quantity;
  //   return res;
  // }, {})

  // transformData.filter(item=>item.movementType == 'OUTPUT').reduce(function(res, value) {
  //   if (!res[value.date]) {
  //     res[value.date] = { month: value.date, amount: 0 };
  //     masterData.egress.monthlyData.push(res[value.date])
  //   }
  //   res[value.date].amount += value.quantity;
  //   return res;
  // }, {})
  return masterData;
};
const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const getActualMonth = () => {
  let d = new Date();
  let name = month[d.getMonth()];
  return name;
};

export const getYear = () => {
  return new Date().getFullYear();
};

export const simpleDateToDateObj = (date) => {
  console.log('fecha a dateObj', date);
  var dateParts;
  if (date.includes('/')) {
    dateParts = date.split('/');
  }
  if (date.includes('-')) {
    dateParts = date.split('-');
  }
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  return dateObject;
};

export const ISODateToDateObj = (date) => {
  console.log('fecha a dateObj', date);
  var dateParts;
  if (date.includes('/')) {
    dateParts = date.split('/');
  }
  if (date.includes('-')) {
    dateParts = date.split('-');
  }
  var dateObject = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
  return dateObject;
};

export const isObjEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const isObjEmptyFull = (obj) => {
  return Object.values(obj).every((val) => val.length === 0);
};

export const parseToGoodDate = (date) => {
  if (isNaN(date)) {
    return toEpoch(simpleDateToDateObj(date));
  } else {
    return Number(date);
  }
};

export const getUbigeos = () => {
  fetch('./ubigeo.json', {
    headers: {
      'Content-type': 'application/json',
      Acept: 'application/json',
    },
  })
    .then(function (res) {
      console.log(res);
      return res.json();
    })
    .then(function (json) {
      console.log(json);
    });
};

export const fixDecimals = (number) => {
  return Number(Number(number).toFixed(3));
};

export const showSubtypeMovement = (type, text) => {
  if (!text) {
    switch (type) {
      case 'production':
        return <IntlMessages id='movements.type.production' />;
        break;
      case 'buys':
        return <IntlMessages id='movements.type.buys' />;
        break;
      case 'expired':
        return <IntlMessages id='movements.type.expired' />;
        break;
      case 'sales':
        return <IntlMessages id='movements.type.sales' />;
        break;
      case 'sale':
        return <IntlMessages id='movements.type.sales' />;
        break;
      case 'internalUses':
        return <IntlMessages id='movements.type.internalUses' />;
        break;
      case 'sampling':
        return <IntlMessages id='movements.type.sampling' />;
        break;
      case 'otherUses':
        return <IntlMessages id='movements.type.otherUses' />;
        break;
      default:
        return null;
    }
  } else {
    switch (type) {
      case 'production':
        return 'Producción';
        break;
      case 'buys':
        return 'Compras';
        break;
      case 'expired':
        return 'Producto vencido';
        break;
      case 'sales':
        return 'Ventas';
        break;
      case 'sale':
        return 'Ventas';
        break;
      case 'internalUses':
        return 'Usos internos';
        break;
      case 'sampling':
        return 'Muestreo';
        break;
      case 'otherUses':
        return 'Otros usos';
        break;
      default:
        return '';
    }
  }
};

export const isEmpty = (obj) => {
  return Object.values(obj).every((x) => x === null || x === '');
};

export const completeWithZeros = (num, size) => {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
};

export const verTags = (obj, listBussinesParameteres) => {
  let descripcion = '';
  let listTagsClient = null;

  if (listBussinesParameteres)
    listTagsClient = listBussinesParameteres.find(
      (obj) => obj.abreParametro == 'CLIENT_TAGS',
    ).value;

  if (obj.tags)
    obj.tags.forEach((item) => {
      if (listTagsClient.some((obj) => obj.id == item)) {
        let descripciontemp = '';
        console.log('listTagsClient', listTagsClient);
        if (listTagsClient)
          descripciontemp = listTagsClient.find(
            (obj) => obj.id == item,
          ).tagName;

        if (descripcion.length == 0) {
          descripcion = descripciontemp;
        } else {
          descripcion = descripcion + ' | ' + descripciontemp;
        }
      }
    });

  return descripcion;
};

export const verNotificaciones = (listBussinesParameteres) => {
  let listNotificationClient = null;
  console.log('listBussinesParameteres este es', listBussinesParameteres);
  if (listBussinesParameteres)
    listNotificationClient = listBussinesParameteres.find(
      (obj) => obj.abreParametro == 'NOTIFICATION_CLIENTS',
    ).value;

  return listNotificationClient;
};

export const verTiposEventos = (listBussinesParameteres) => {
  let listNotificationClient = null;
  let listNotificationBusiness = null;
  console.log('listBussinesParameteres este es', listBussinesParameteres);
  if (listBussinesParameteres)
    listNotificationClient = listBussinesParameteres.find(
      (obj) => obj.abreParametro == 'NOTIFICATION_CATALOG',
    ).value;
  if (listBussinesParameteres)
    listNotificationBusiness = listBussinesParameteres.find(
      (obj) => obj.abreParametro == 'NOTIFICATION_CATALOG',
    );
  const arrayListNotification = Object.keys(listNotificationClient).map(
    (obj) => listNotificationClient[obj],
  );
  return [
    arrayListNotification,
    listNotificationClient,
    listNotificationBusiness,
  ];
};

export const showReferralGuideReason = (text, reason) => {
  if (text === 'spanish') {
    //newRoute
    switch (reason) {
      case 'compra':
        return <IntlMessages id='referralGuide.reason.buys' />;
        break;
      case 'venta':
        return <IntlMessages id='referralGuide.reason.sales' />;
        break;
      case 'venta_sujeta_a_confirmación_del_comprador':
        return (
          <IntlMessages id='referralGuide.reason.saleSubjectToBuyerConfirmation' />
        );
        break;
      case 'traslado_entre_establecimientos_de_la_misma_empresa':
        return (
          <IntlMessages id='referralGuide.reason.transferBetweenEstablishmentsOfTheSameCompany.' />
        );
        break;
      case 'traslado_emisor_itinerante_CP':
        return (
          <IntlMessages id='referralGuide.reason.itinerantSenderTransferCP' />
        );
        break;
      case 'importación':
        return <IntlMessages id='referralGuide.reason.import' />;
        break;
      case 'exportación':
        return <IntlMessages id='referralGuide.reason.export' />;
        break;
      case 'traslado_a_zona_primaria':
        return <IntlMessages id='referralGuide.reason.transferToPrimaryArea' />;
        break;
      case 'devolucion':
        return <IntlMessages id='referralGuide.reason.return' />;
        break;
      case 'venta_con_entrega_a_terceros':
        return <IntlMessages id='referralGuide.reason.saleToThirdParties' />;
        break;
      case 'consignacion':
        return <IntlMessages id='referralGuide.reason.consignment' />;
        break;
      case 'recojo_de_bienes_transformados':
        return (
          <IntlMessages id='referralGuide.reason.collectionOfTransformedGoods' />
        );
        break;
      case 'otros':
        return <IntlMessages id='referralGuide.reason.others' />;
        break;
      default:
        return <IntlMessages id='referralGuide.reason.sales' />;
    }
  } else if (text === 'english') {
    //predefined
    switch (reason) {
      case 'buy':
        return <IntlMessages id='referralGuide.reason.buys' />;
        break;
      case 'sale':
        return <IntlMessages id='referralGuide.reason.sales' />;
        break;
      case 'saleSubjectToBuyersConfirmation':
        return (
          <IntlMessages id='referralGuide.reason.saleSubjectToBuyerConfirmation' />
        );
        break;
      case 'transferBetweenEstablishmentsOfTheSameCompany':
        return (
          <IntlMessages id='referralGuide.reason.transferBetweenEstablishmentsOfTheSameCompany.' />
        );
        break;
      case 'transferItinerantIssuerCP':
        return (
          <IntlMessages id='referralGuide.reason.itinerantSenderTransferCP' />
        );
        break;
      case 'import':
        return <IntlMessages id='referralGuide.reason.import' />;
        break;
      case 'export':
        return <IntlMessages id='referralGuide.reason.export' />;
        break;
      case 'transferToPrimaryZone':
        return <IntlMessages id='referralGuide.reason.transferToPrimaryArea' />;
        break;
      case 'return':
        return <IntlMessages id='referralGuide.reason.return' />;
        break;
      case 'others':
        return <IntlMessages id='referralGuide.reason.others' />;
        break;
      case 'saleToThirdParties':
        return <IntlMessages id='referralGuide.reason.saleToThirdParties' />;
        break;
      case 'consignment':
        return <IntlMessages id='referralGuide.reason.consignment' />;
        break;
      case 'collectionOfTransformedGoods':
        return (
          <IntlMessages id='referralGuide.reason.collectionOfTransformedGoods' />
        );
        break;
      default:
        return <IntlMessages id='referralGuide.reason.sales' />;
    }
  } else {
    switch (reason) {
      case 'compra':
        return 'buy';
        break;
      case 'venta':
        return 'sale';
        break;
      case 'venta_sujeta_a_confirmación_del_comprador':
        return 'saleSubjectToBuyersConfirmation';
        break;
      case 'traslado_entre_establecimientos_de_la_misma_empresa':
        return 'transferBetweenEstablishmentsOfTheSameCompany';
        break;
      case 'traslado_emisor_itinerante_CP':
        return 'transferItinerantIssuerCP';
        break;
      case 'importación':
        return 'import';
        break;
      case 'exportación':
        return 'export';
        break;
      case 'traslado_a_zona_primaria':
        return 'transferToPrimaryZone';
        break;
      case 'devolucion':
        return 'return';
        break;
      case 'otros':
        return 'others';
        break;
      case 'venta_con_entrega_a_terceros':
        return 'saleToThirdParties';
        break;
      case 'consignacion':
        return 'consignment';
        break;
      case 'recojo_de_bienes_transformados':
        return 'collectionOfTransformedGoods';
        break;
      default:
        return null;
    }
  }
};
