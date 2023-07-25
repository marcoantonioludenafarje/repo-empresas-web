import React, {useEffect} from 'react';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@crema/utility/IntlMessages';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Collapse,
  Button,
  IconButton,
} from '@mui/material';
import Router, {useRouter} from 'next/router';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Typography from '@mui/material/Typography';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import PropTypes from 'prop-types';
import {
  getActualMonth,
  getYear,
  translateValue,
  fixDecimals,
} from '../../../Utils/utils';
// import {showStatus} from '../../../Utils/utilsFinances';
import {shallowEqual} from 'react-redux';
import {useDispatch, useSelector} from 'react-redux';

import {
  GET_FINANCES,
  NULLIFY_MAIL,
} from '../../../shared/constants/ActionTypes';
import {getFinances} from '../../../redux/actions/Finances';
let listFinancesPayload = {
  request: {
    payload: {
      initialTime: null,
      finalTime: null,
      movementType: null,
      merchantId: '',
      createdAt: null,
      monthMovement: null,
      yearMovement: null,
      searchByBill: '',
      searchByContableMovement: '',
      typeList: '',
    },
  },
};
const XLSX = require('xlsx');

const months = {
  january: 'Enero',
  february: 'Febrero',
  march: 'Marzo',
  april: 'Abril',
  may: 'Mayo',
  june: 'Junio',
  july: 'Julio',
  august: 'Agosto',
  september: 'Septiembre',
  october: 'Octubre',
  november: 'Noviembre',
  december: 'Diciembre',
};

let selectedFinance = '';

const ResultState = ({data, principalYear, principalMonth}) => {
  const [incomes, setIncomes] = React.useState([]);
  const [expenses, setExpenses] = React.useState([]);
  const [totalIncome, setTotalIncome] = React.useState(0);
  const [totalExpense, setTotalExpense] = React.useState(0);
  const [profit, setProfit] = React.useState(0);
  const [showIncomes, setShowIncomes] = React.useState(true);
  const [showExpenses, setShowExpenses] = React.useState(true);
  const [openPaids, setOpenPaids] = React.useState(false);
  const [openPaids2, setOpenPaids2] = React.useState(false);
  const [openOtherPayConcepts, setOpenOtherPayConcepts] = React.useState(false);
  const [openOtherPayConcepts2, setOpenOtherPayConcepts2] =
    React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  const [rowNumber2, setRowNumber2] = React.useState(0);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openDocuments, setOpenDocuments] = React.useState(false);
  const {moneySymbol} = useSelector(({general}) => general);

  const {jwtToken} = useSelector(({general}) => general);

  const dispatch = useDispatch();
  let {getFinancesRes} = useSelector(({finances}) => finances);
  //APIS
  const toGetFinances = (payload) => {
    dispatch(getFinances(payload, jwtToken));
  };

  useEffect(() => {
    console.log('Data de ResultState', data);
    // getFinancesRes = [];
    // listFinancesPayload.request.payload.monthMovement = data.monthMovement
    // listFinancesPayload.request.payload.yearMovement = data.yearMovement
    // listFinancesPayload.request.payload.merchantId = data.merchantId
    // toGetFinances(listFinancesPayload);
    // setTimeout(() => {
    //   filterData();
    // }, "3000")

    filterData();
  }, []);

  const filterData = () => {
    let preIncomes = [];
    let preExpenses = [];
    let preTotalIncome = 0;
    let preTotalExpense = 0;
    let preProfit = 0;
    data.map((obj) => {
      if (obj.movementType == 'INCOME') {
        preIncomes.push(obj);
        preTotalIncome += obj.totalAmount;
      } else if (obj.movementType == 'EXPENSE') {
        preExpenses.push(obj);
        preTotalExpense += obj.totalAmount;
      } else {
        null;
      }
    });
    preProfit = preTotalIncome - preTotalExpense;
    setIncomes(preIncomes);
    setExpenses(preExpenses);
    setTotalIncome(preTotalIncome);
    setTotalExpense(preTotalExpense);
    setProfit(preProfit);
    console.log('preIncomes', preIncomes);
    console.log('preExpenses', preExpenses);
    console.log('preTotalIncome', preTotalIncome);
    console.log('preTotalExpense', preTotalExpense);
    console.log('preProfit', preProfit);
  };

  const {messages} = useIntl();
  const showStatus = (status, typeFinance) => {
    if (typeFinance == 'INCOME') {
      switch (status) {
        case 'paid':
          return messages['finance.status.income.paid'];
          break;
        case 'advance':
          return messages['finance.status.income.advance'];
          break;
        case 'toPaid':
          return messages['finance.status.income.toPaid'];
          break;
        default:
          return null;
      }
    } else if (typeFinance == 'EXPENSE') {
      switch (status) {
        case 'paid':
          return messages['finance.status.expense.paid'];
          break;
        case 'advance':
          return messages['finance.status.expense.advance'];
          break;
        case 'toPaid':
          return messages['finance.status.expense.toPaid'];
          break;
        default:
          return null;
      }
    } else {
      return null;
    }
  };
  const compare = (a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    return 0;
  };

  const getMonthYear = () => {
    const monthToSet = principalMonth
      ? months[principalMonth.toLowerCase()].toUpperCase()
      : 'Todos los meses';
    const yearToSet = principalYear ? principalYear : 'Todos los años';
    if (!principalMonth && !principalYear) {
      return `TODOS LOS RESULTADOS`;
    } else {
      return /* EJERCICIO  */ `${monthToSet} ${yearToSet}`;
    }
  };

  const showMinType = (type) => {
    switch (type) {
      case 'INCOME':
        return messages['transaction.type.income.acronym'];

        break;
      case 'EXPENSE':
        return messages['transaction.type.expense.acronym'];
        break;
      default:
        return null;
    }
  };
  const showType = (type) => {
    switch (type) {
      case 'INCOME':
        return messages['finance.type.income'];
        break;
      case 'EXPENSE':
        return messages['finance.type.expense'];
        break;
      default:
        return null;
    }
  };
  const cleanList = (list, type) => {
    let listResult = [];
    list.map((obj) => {
      //ESTOS CAMPOS DEBEN TENER EL MISMO NOMBRE, TANTO ARRIBA COMO ABAJO
      console.log('estado inicial pasado al excel', obj.status);
      console.log('estado pasado al excel', obj.status);
      obj.pays = '';
      obj.payments.forEach((item) => {
        obj.pays =
          obj.pays +
          `${
            item.description || item.descriptionPayment || 'Pago sin detalle'
          } - ${item.amount}; `;
      });
      obj.otherPayConcepts = '';
      if (obj.otherPayConcepts && obj.otherPayConcepts.length > 0) {
        obj.otherPayConceptsInString.forEach((item) => {
          obj.otherPayConceptsInString =
            obj.otherPayConceptsInString +
            `${
              item.description || item.descriptionPayment || 'Pago sin detalle'
            } - ${item.amount}; `;
        });
      } else {
        obj.otherPayConceptsInString = '';
      }

      obj.pays = obj.pays.toString();
      obj.otherPayConceptsInString = obj.otherPayConceptsInString.toString();

      console.log('pagos pasado al excel', obj.pays);
      obj.financeCode = `${showMinType(obj.codMovement.split('-')[0])} - ${
        obj.codMovement
          ? obj.codMovement.split('-')[1]
          : obj.folderMovement.split('/').slice(-1)
      }`;
      obj.typeFinance = `${showType(obj.movementType)}`;
      obj.identifierFinance = `${obj.typeDocumentProvider} ${obj.numberDocumentProvider}`;
      obj.statusFinance = `${showStatus(obj.status, obj.movementType)}`;
      obj.dateBill = obj.billIssueDate;
      obj.purchaseTypeFinance = obj.purchaseType
        ? messages[
            translateValue('PAYMENTMETHOD', obj.purchaseType.toUpperCase())
              .props.id
          ]
        : null;
      listResult.push(
        (({
          financeCode,
          typeFinance,
          identifierFinance,
          dateBill,
          denominationProvider,
          serialNumberBill,
          description,
          observation,
          statusFinance,
          purchaseTypeFinance,
          pays,
          otherPayConceptsInString,
          totalAmount,
          totalAmountWithConcepts,
          paid,
          debt,
        }) => ({
          financeCode,
          typeFinance,
          identifierFinance,
          dateBill,
          denominationProvider,
          serialNumberBill,
          description,
          observation,
          statusFinance,
          purchaseTypeFinance,
          pays,
          otherPayConceptsInString,
          totalAmount,
          totalAmountWithConcepts,
          paid,
          debt,
        }))(obj),
      );
    });
    return listResult;
  };
  const headersExcel = [
    'Código',
    'Tipo',
    'Identificador Negocio',
    'Fecha de Factura',
    'Nombre / Razón social',
    'Número de Factura',
    'Detalle de Compra',
    'Observaciones',
    'Estado',
    'Tipo de Compra',
    'Pagos de Factura',
    'Otros Pagos',
    'Monto Factura(con Igv)',
    'Monto a Pagar/Cobrar',
    'Monto Pagado/Cobrado',
    'Deuda pendiente',
  ];
  const exportDoc = () => {
    const incomeWs = XLSX.utils.json_to_sheet(cleanList(incomes, 'INCOME'));
    const expenseWs = XLSX.utils.json_to_sheet(cleanList(expenses, 'EXPENSE'));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, incomeWs, 'Ingresos');
    XLSX.utils.book_append_sheet(wb, expenseWs, 'Egresos');
    XLSX.utils.sheet_add_aoa(incomeWs, [headersExcel], {origin: 'A1'});
    XLSX.utils.sheet_add_aoa(expenseWs, [headersExcel], {origin: 'A1'});
    XLSX.writeFile(wb, 'Estado de resultado.xlsx');
  };

  const goToDocument = (doc) => {
    if (doc.typeDocument == 'bill') {
      if (doc.billId) {
        Router.push({
          pathname: '/sample/bills/table',
          query: {billId: doc.billId},
        });
      }
    } else if (doc.typeDocument == 'referralGuide') {
      if (doc.referralGuideId) {
        Router.push({
          pathname: '/sample/referral-guide/table',
          query: {movementHeaderId: doc.referralGuideId},
        });
      }
    } else {
      return null;
    }
  };

  const checkPaids = (input, index) => {
    selectedFinance = input;
    console.log('selectedFinance', selectedFinance);
    setOpenOtherPayConcepts(false);
    setOpenPaids(true);
    if (openPaids == true && rowNumber == index) {
      setOpenPaids(false);
    }
    setRowNumber(index);
  };
  const checkPaids2 = (input, index) => {
    selectedFinance = input;
    console.log('selectedFinance', selectedFinance);
    setOpenOtherPayConcepts2(false);
    setOpenPaids2(true);
    if (openPaids2 == true && rowNumber == index) {
      setOpenPaids2(false);
    }
    setRowNumber(index);
  };
  const checkOtherPayConcepts = (input, index) => {
    selectedFinance = input;
    console.log('selectedFinance', selectedFinance);
    setOpenPaids(false);
    setOpenOtherPayConcepts(true);
    if (openOtherPayConcepts == true && rowNumber == index) {
      setOpenOtherPayConcepts(false);
    }
    setRowNumber(index);
  };
  const checkOtherPayConcepts2 = (input, index) => {
    selectedFinance = input;
    console.log('selectedFinance', selectedFinance);
    setOpenPaids2(false);
    setOpenOtherPayConcepts2(true);
    if (openOtherPayConcepts2 == true && rowNumber == index) {
      setOpenOtherPayConcepts2(false);
    }
    setRowNumber(index);
  };
  const checkDocuments = (input, index) => {
    selectedFinance = input;
    console.log('selectedFinance', selectedFinance);
    if (openDetails == true) {
      setOpenDetails(false);
    }
    setOpenDocuments(false);
    setOpenDocuments(true);
    if (openDocuments == true && rowNumber == index) {
      setOpenDocuments(false);
    }
    setRowNumber(index);
  };
  const showCanceled = (bool) => {
    if (bool) {
      return (
        <Typography sx={{color: 'error.light', fontWeight: '500'}}>
          <IntlMessages sx={{color: 'red'}} id='common.yes' />
        </Typography>
      );
    } else {
      return <></>;
    }
  };

  const goToFile = (folder) => {
    /* Router.push({
      pathname: '/sample/explorer',
      query: {
        goDirectory: true,
        path: folder,
      },
    }); */
    const data = {
      goDirectory: true,
      path: folder,
    };
    localStorage.setItem('redirectUrl', JSON.stringify(data));
    window.open('/sample/explorer');
  };

  return (
    <Box sx={{width: 1}}>
      <Button
        onClick={() => exportDoc()}
        variant='outlined'
        sx={{m: 4}}
        startIcon={<GridOnOutlinedIcon />}
      >
        Descargar estado de resultado
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} size='small' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={8}
                sx={{textAlign: 'center', fontSize: '1.1em'}}
              >
                {getMonthYear()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={7}>TOTAL INGRESOS (PEN)</TableCell>
              <TableCell align='right'>{totalIncome.toFixed(3)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={7}>TOTAL EGRESOS (PEN)</TableCell>
              <TableCell align='right'>{totalExpense.toFixed(3)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={7}>UTILIDAD OPERATIVA (PEN)</TableCell>
              <TableCell align='right'>{profit.toFixed(3)}</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <TableContainer
        component={Paper}
        sx={{maxHeight: 440, my: 3, maxWidth: 950}}
      >
        <Table stickyHeader size='small' aria-label='simple table'>
          <TableHead>
            <TableRow
              sx={{
                '&:last-child td, &:last-child th': {border: 0},
                cursor: 'pointer',
              }}
              onClick={() => setShowIncomes(!showIncomes)}
            >
              <TableCell sx={{textAlign: 'center'}} colSpan={8}>
                INGRESOS
              </TableCell>
            </TableRow>
          </TableHead>
          <Collapse in={showIncomes}>
            <TableHead>
              <TableRow>
                <TableCell>Codigo</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Identificador negocio</TableCell>
                <TableCell>Fecha de Factura</TableCell>
                <TableCell>Nombre / Razón social</TableCell>
                <TableCell>Número de Factura</TableCell>
                <TableCell>Detalle Documentos</TableCell>
                <TableCell>Detalle de Compra</TableCell>
                <TableCell>Observaciones</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Método de Pago</TableCell>
                <TableCell>Tipo de compra</TableCell>
                <TableCell>Pagos de Factura</TableCell>
                <TableCell>Otros Pagos</TableCell>
                <TableCell>Monto Factura(con igv)</TableCell>
                <TableCell>Monto a Pagar/Cobrar</TableCell>
                <TableCell>Monto Pagado/Cobrado</TableCell>
                <TableCell>Deuda pendiente</TableCell>
                <TableCell>Ir a archivo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incomes.sort(compare).map((obj, index) => {
                const paids = obj.payments;
                const otherPayConcepts = obj.otherPayConcepts;
                return (
                  <>
                    <TableRow key={`${index}-income`}>
                      <TableCell>{`${showMinType(
                        obj.codMovement.split('-')[0],
                      )} - ${
                        obj.codMovement
                          ? obj.codMovement.split('-')[1]
                          : obj.folderMovement.split('/').slice(-1)
                      }`}</TableCell>
                      <TableCell>{showType(obj.movementType)}</TableCell>
                      <TableCell>{`${obj.typeDocumentProvider} ${obj.numberDocumentProvider}`}</TableCell>
                      <TableCell>{obj.billIssueDate}</TableCell>
                      <TableCell>{obj.denominationProvider}</TableCell>
                      <TableCell>{obj.serialNumberBill}</TableCell>
                      <TableCell align='center'>
                        {obj.documentsMovement &&
                        obj.documentsMovement.length != 0 ? (
                          <IconButton
                            onClick={() => checkDocuments(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell>{obj.description}</TableCell>
                      <TableCell>{obj.observation}</TableCell>
                      <TableCell>{showStatus(obj.status, 'INCOME')}</TableCell>
                      <TableCell>
                        {obj.purchaseType
                          ? translateValue(
                              'PAYMENTMETHOD',
                              obj.methodToPay.toUpperCase(),
                            )
                          : null}
                      </TableCell>
                      <TableCell>
                        {obj.purchaseType
                          ? translateValue(
                              'PURCHASETYPE',
                              obj.purchaseType.toUpperCase(),
                            )
                          : null}
                      </TableCell>
                      <TableCell>
                        {paids.length !== 0 ? (
                          <IconButton
                            onClick={() => checkPaids(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {otherPayConcepts && otherPayConcepts.length !== 0 ? (
                          <IconButton
                            onClick={() => checkOtherPayConcepts(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : null}
                      </TableCell>
                      <TableCell>{`${moneySymbol} ${fixDecimals(
                        obj.totalAmount,
                      )}`}</TableCell>
                      <TableCell>{`${moneySymbol} ${fixDecimals(
                        obj.totalAmountWithConcepts,
                      )}`}</TableCell>
                      <TableCell>
                        {`${moneySymbol} ${fixDecimals(obj.paid)}`}
                      </TableCell>
                      <TableCell>
                        {`${moneySymbol} ${fixDecimals(obj.debt)}`}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => goToFile(obj.folderMovement)}
                        >
                          <FolderOpenIcon sx={{mr: 1, my: 'auto'}} />
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    <TableRow key={`doc1-${index}`}>
                      <TableCell
                        style={{paddingBottom: 0, paddingTop: 0}}
                        colSpan={14}
                      >
                        <Collapse
                          in={openPaids && index == rowNumber}
                          timeout='auto'
                          unmountOnExit
                        >
                          <Box sx={{margin: 0}}>
                            <Table size='small' aria-label='purchases'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Nro</TableCell>
                                  <TableCell>Descripción</TableCell>
                                  <TableCell>Monto</TableCell>
                                  <TableCell>Método de pago</TableCell>
                                  <TableCell>Estado de pago</TableCell>
                                  <TableCell>Fecha de pago</TableCell>
                                  <TableCell>Fecha de vencimiento</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {paids && paids.length !== 0
                                  ? paids.map((paid, index) => {
                                      return (
                                        <TableRow
                                          key={index}
                                          sx={{cursor: 'pointer'}}
                                        >
                                          <TableCell>
                                            {paid.transactionNumber}
                                          </TableCell>
                                          <TableCell>
                                            {paid.description}
                                          </TableCell>
                                          <TableCell>{paid.amount}</TableCell>
                                          <TableCell>
                                            {paid.paymentMethod
                                              ? translateValue(
                                                  'PAYMENTMETHOD',
                                                  paid.paymentMethod.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>
                                            {paid.statusPayment
                                              ? translateValue(
                                                  'PAYMENTS',
                                                  paid.statusPayment.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>{paid.payDate}</TableCell>
                                          <TableCell>
                                            {paid.expirationDate}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })
                                  : null}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`doc2-${index}`}>
                      <TableCell
                        style={{paddingBottom: 0, paddingTop: 0}}
                        colSpan={14}
                      >
                        <Collapse
                          in={openOtherPayConcepts && index == rowNumber}
                          timeout='auto'
                          unmountOnExit
                        >
                          <Box sx={{margin: 0}}>
                            <Table size='small' aria-label='purchases'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Nro</TableCell>
                                  <TableCell>Descripción</TableCell>
                                  <TableCell>Monto</TableCell>
                                  <TableCell>Acción</TableCell>
                                  <TableCell>Comentario</TableCell>
                                  <TableCell>Método de pago</TableCell>
                                  <TableCell>Estado de pago</TableCell>
                                  <TableCell>Fecha de pago</TableCell>
                                  <TableCell>Fecha de vencimiento</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {otherPayConcepts &&
                                otherPayConcepts.length !== 0
                                  ? otherPayConcepts.map((paid, index) => {
                                      return (
                                        <TableRow
                                          key={index}
                                          sx={{cursor: 'pointer'}}
                                        >
                                          <TableCell>
                                            {paid.transactionNumber ||
                                              paid.numInstallment}
                                          </TableCell>
                                          <TableCell>
                                            {paid.description ||
                                              paid.descriptionPayment}
                                          </TableCell>
                                          <TableCell>{`${moneySymbol} ${paid.amount}`}</TableCell>
                                          <TableCell>
                                            {paid.conceptAction
                                              ? translateValue(
                                                  'CONCEPTACTION',
                                                  paid.conceptAction.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>
                                            {paid.commentPayment}
                                          </TableCell>
                                          <TableCell>
                                            {paid.paymentMethod
                                              ? translateValue(
                                                  'PAYMENTMETHOD',
                                                  paid.paymentMethod.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>
                                            {paid.statusPayment
                                              ? translateValue(
                                                  'PAYMENTS',
                                                  paid.statusPayment.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>
                                            {paid.payDate || paid.issueDate}
                                          </TableCell>

                                          <TableCell>
                                            {paid.expirationDate}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })
                                  : null}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`doc3-${index}`}>
                      <TableCell
                        style={{paddingBottom: 0, paddingTop: 0}}
                        colSpan={6}
                      >
                        <Collapse
                          in={openDocuments && index == rowNumber}
                          timeout='auto'
                          unmountOnExit
                        >
                          <Box sx={{margin: 0}}>
                            <Table size='small' aria-label='purchases'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Fecha de documento</TableCell>
                                  <TableCell>Número de documento</TableCell>
                                  <TableCell>Tipo de documento</TableCell>
                                  <TableCell>Anulado?</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {obj.documentsMovement !== undefined &&
                                obj.documentsMovement.length !== 0 ? (
                                  obj.documentsMovement.map(
                                    (subDocument, index) => {
                                      return (
                                        <TableRow
                                          key={index}
                                          sx={{cursor: 'pointer'}}
                                          hover
                                          onClick={() =>
                                            goToDocument(subDocument)
                                          }
                                        >
                                          <TableCell>
                                            {subDocument.issueDate}
                                          </TableCell>
                                          <TableCell>
                                            {subDocument.serialDocument}
                                          </TableCell>
                                          <TableCell>
                                            {translateValue(
                                              'DOCUMENTTYPE',
                                              subDocument.typeDocument.toUpperCase(),
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {showCanceled(
                                              subDocument.cancelStatus,
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    },
                                  )
                                ) : (
                                  <></>
                                )}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Collapse>
        </Table>
      </TableContainer>

      <TableContainer
        component={Paper}
        sx={{maxHeight: 440, my: 3, maxWidth: 950}}
      >
        <Table stickyHeader size='small' aria-label='simple table'>
          <TableHead>
            <TableRow
              sx={{
                '&:last-child td, &:last-child th': {border: 0},
                cursor: 'pointer',
              }}
              onClick={() => setShowExpenses(!showExpenses)}
            >
              <TableCell sx={{textAlign: 'center'}} colSpan={8}>
                EGRESOS
              </TableCell>
            </TableRow>
          </TableHead>
          <Collapse in={showExpenses}>
            <TableHead>
              <TableRow>
                <TableCell>Codigo</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Identificador negocio</TableCell>
                <TableCell>Fecha de Factura</TableCell>
                <TableCell>Nombre / Razón social</TableCell>
                <TableCell>Número de Factura</TableCell>
                <TableCell>Detalle Documentos</TableCell>
                <TableCell>Detalle de Compra</TableCell>
                <TableCell>Observaciones</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Método de Pago</TableCell>
                <TableCell>Tipo de compra</TableCell>
                <TableCell>Pagos de Factura</TableCell>
                <TableCell>Otros Pagos</TableCell>
                <TableCell>Monto Factura(con igv)</TableCell>
                <TableCell>Monto a Pagar/Cobrar</TableCell>
                <TableCell>Monto Pagado/Cobrado</TableCell>
                <TableCell>Deuda Pendiente</TableCell>
                <TableCell>Ir a archivo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.sort(compare).map((obj, index) => {
                const paids = obj.payments;
                const otherPayConcepts = obj.otherPayConcepts;

                return (
                  <>
                    <TableRow key={`${index}-expense`}>
                      <TableCell>{`${showMinType(
                        obj.codMovement.split('-')[0],
                      )} - ${
                        obj.codMovement
                          ? obj.codMovement.split('-')[1]
                          : obj.folderMovement.split('/').slice(-1)
                      }`}</TableCell>
                      <TableCell>{showType(obj.movementType)}</TableCell>
                      <TableCell>{`${obj.typeDocumentProvider} ${obj.numberDocumentProvider}`}</TableCell>
                      <TableCell>{obj.billIssueDate}</TableCell>
                      <TableCell>{obj.denominationProvider}</TableCell>
                      <TableCell>{obj.serialNumberBill}</TableCell>
                      <TableCell align='center'>
                        {obj.documentsMovement &&
                        obj.documentsMovement.length != 0 ? (
                          <IconButton
                            onClick={() => checkDocuments(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell>{obj.description}</TableCell>
                      <TableCell>{obj.observation}</TableCell>
                      <TableCell>{showStatus(obj.status, 'EXPENSE')}</TableCell>
                      <TableCell>
                        {obj.purchaseType
                          ? translateValue(
                              'PAYMENTMETHOD',
                              obj.methodToPay.toUpperCase(),
                            )
                          : null}
                      </TableCell>
                      <TableCell>
                        {obj.purchaseType
                          ? translateValue(
                              'PURCHASETYPE',
                              obj.purchaseType.toUpperCase(),
                            )
                          : null}
                      </TableCell>
                      <TableCell>
                        {paids.length !== 0 ? (
                          <IconButton
                            onClick={() => checkPaids2(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {otherPayConcepts && otherPayConcepts.length !== 0 ? (
                          <IconButton
                            onClick={() => checkOtherPayConcepts2(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : null}
                      </TableCell>
                      <TableCell>{`${moneySymbol} ${fixDecimals(
                        obj.totalAmount,
                      )}`}</TableCell>
                      <TableCell>{`${moneySymbol} ${fixDecimals(
                        obj.totalAmountWithConcepts,
                      )}`}</TableCell>
                      <TableCell>
                        {`${moneySymbol} ${fixDecimals(obj.paid)}`}
                      </TableCell>
                      <TableCell>
                        {`${moneySymbol} ${fixDecimals(obj.debt)}`}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => goToFile(obj.folderMovement)}
                        >
                          <FolderOpenIcon sx={{mr: 1, my: 'auto'}} />
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    <TableRow key={`doc4-${index}`}>
                      <TableCell
                        style={{paddingBottom: 0, paddingTop: 0}}
                        colSpan={14}
                      >
                        <Collapse
                          in={openPaids2 && index == rowNumber}
                          timeout='auto'
                          unmountOnExit
                        >
                          <Box sx={{margin: 0}}>
                            <Table size='small' aria-label='purchases'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Nro</TableCell>
                                  <TableCell>Descripción</TableCell>
                                  <TableCell>Monto</TableCell>
                                  <TableCell>Método de pago</TableCell>
                                  <TableCell>Estado de pago</TableCell>
                                  <TableCell>Fecha de pago</TableCell>
                                  <TableCell>Fecha de vencimiento</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {paids && paids.length !== 0
                                  ? paids.map((paid, index) => {
                                      return (
                                        <TableRow
                                          key={index}
                                          sx={{cursor: 'pointer'}}
                                          hover
                                        >
                                          <TableCell>
                                            {paid.transactionNumber}
                                          </TableCell>
                                          <TableCell>
                                            {paid.description}
                                          </TableCell>
                                          <TableCell>{paid.amount}</TableCell>
                                          <TableCell>
                                            {paid.paymentMethod
                                              ? translateValue(
                                                  'PAYMENTMETHOD',
                                                  paid.paymentMethod.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>
                                            {paid.statusPayment
                                              ? translateValue(
                                                  'PAYMENTS',
                                                  paid.statusPayment.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>{paid.payDate}</TableCell>
                                          <TableCell>
                                            {paid.expirationDate}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })
                                  : null}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`doc5-${index}`}>
                      <TableCell
                        style={{paddingBottom: 0, paddingTop: 0}}
                        colSpan={14}
                      >
                        <Collapse
                          in={openOtherPayConcepts && index == rowNumber}
                          timeout='auto'
                          unmountOnExit
                        >
                          <Box sx={{margin: 0}}>
                            <Table size='small' aria-label='purchases'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Nro</TableCell>
                                  <TableCell>Descripción</TableCell>
                                  <TableCell>Monto</TableCell>
                                  <TableCell>Acción</TableCell>
                                  <TableCell>Comentario</TableCell>
                                  <TableCell>Método de pago</TableCell>
                                  <TableCell>Estado de pago</TableCell>
                                  <TableCell>Fecha de pago</TableCell>
                                  <TableCell>Fecha de vencimiento</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {otherPayConcepts &&
                                otherPayConcepts.length !== 0
                                  ? otherPayConcepts.map((paid, index) => {
                                      return (
                                        <TableRow
                                          key={index}
                                          sx={{cursor: 'pointer'}}
                                        >
                                          <TableCell>
                                            {paid.transactionNumber ||
                                              paid.numInstallment}
                                          </TableCell>
                                          <TableCell>
                                            {paid.description ||
                                              paid.descriptionPayment}
                                          </TableCell>
                                          <TableCell>{`${moneySymbol} ${paid.amount}`}</TableCell>
                                          <TableCell>
                                            {paid.conceptAction
                                              ? translateValue(
                                                  'CONCEPTACTION',
                                                  paid.conceptAction.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>
                                            {paid.commentPayment}
                                          </TableCell>
                                          <TableCell>
                                            {paid.paymentMethod
                                              ? translateValue(
                                                  'PAYMENTMETHOD',
                                                  paid.paymentMethod.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>
                                            {paid.statusPayment
                                              ? translateValue(
                                                  'PAYMENTS',
                                                  paid.statusPayment.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>
                                            {paid.payDate || paid.issueDate}
                                          </TableCell>

                                          <TableCell>
                                            {paid.expirationDate}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })
                                  : null}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`doc6-${index}`}>
                      <TableCell
                        style={{paddingBottom: 0, paddingTop: 0}}
                        colSpan={6}
                      >
                        <Collapse
                          in={openDocuments && index == rowNumber}
                          timeout='auto'
                          unmountOnExit
                        >
                          <Box sx={{margin: 0}}>
                            <Table size='small' aria-label='purchases'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Fecha de documento</TableCell>
                                  <TableCell>Número de documento</TableCell>
                                  <TableCell>Tipo de documento</TableCell>
                                  <TableCell>Anulado?</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {obj.documentsMovement !== undefined &&
                                obj.documentsMovement.length !== 0 ? (
                                  obj.documentsMovement.map(
                                    (subDocument, index) => {
                                      return (
                                        <TableRow
                                          key={index}
                                          sx={{cursor: 'pointer'}}
                                          hover
                                          onClick={() =>
                                            goToDocument(subDocument)
                                          }
                                        >
                                          <TableCell>
                                            {subDocument.issueDate}
                                          </TableCell>
                                          <TableCell>
                                            {subDocument.serialDocument}
                                          </TableCell>
                                          <TableCell>
                                            {translateValue(
                                              'DOCUMENTTYPE',
                                              subDocument.typeDocument.toUpperCase(),
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {showCanceled(
                                              subDocument.cancelStatus,
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    },
                                  )
                                ) : (
                                  <></>
                                )}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Collapse>
        </Table>
      </TableContainer>
    </Box>
  );
};

ResultState.propTypes = {
  data: PropTypes.array.isRequired,
  principalYear: PropTypes.string,
  principalMonth: PropTypes.string.isRequired,
};

export default ResultState;
