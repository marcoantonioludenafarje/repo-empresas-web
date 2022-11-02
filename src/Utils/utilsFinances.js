import IntlMessages from '../@crema/utility/IntlMessages';

export const showStatus = (status, typeFinance) => {
  if (typeFinance == 'INCOME') {
    switch (status) {
      case 'paid':
        return <IntlMessages id='finance.status.income.paid' />;
        break;
      case 'advance':
        return <IntlMessages id='finance.status.income.advance' />;
        break;
      case 'toPaid':
        return <IntlMessages id='finance.status.income.toPaid' />;
        break;
      default:
        return null;
    }
  } else if (typeFinance == 'EXPENSE') {
    switch (status) {
      case 'paid':
        return <IntlMessages id='finance.status.expense.paid' />;
        break;
      case 'advance':
        return <IntlMessages id='finance.status.expense.advance' />;
        break;
      case 'toPaid':
        return <IntlMessages id='finance.status.expense.toPaid' />;
        break;
      default:
        return null;
    }
  } else {
    return null;
  }
};
