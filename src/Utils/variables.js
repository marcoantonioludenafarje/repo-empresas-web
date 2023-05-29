import IntlMessages from '../@crema/utility/IntlMessages';

export const dictionary = {
  COINS: {
    PEN: 'S/.',
    USD: '$',
  },
  MESSAGES: {
    IWANTSUBSCRIPTION: <IntlMessages id='message.subscription.iwant' />,
    TERMSANDCONDITIONS: <IntlMessages id='common.termConditions' />,
    SENDACTIVATIONREQUEST: (
      <IntlMessages id='message.send.activation.request' />
    ),
  },
  TYPEOFTRANSACTION: {
    INPUT: <IntlMessages id='movements.type.input' />,
    OUTPUT: <IntlMessages id='movements.type.output' />,
    INCOME: <IntlMessages id='movements.type.income' />,
    EXPENSE: <IntlMessages id='movements.type.expense' />,
  },
  MOVEMENT_TYPES: {
    sales: <IntlMessages id='movements.type.sales' />,
    sampling: <IntlMessages id='movements.type.sampling' />,
    internalUses: <IntlMessages id='movements.type.internalUses' />,
    production: <IntlMessages id='movements.type.production' />,
    expired: <IntlMessages id='movements.type.expired' />,
    otherUses: <IntlMessages id='movements.type.otherUses' />,
    buys: <IntlMessages id='movements.type.buys' />,
  },
  CONTABLE_MOVEMENTS: {
    INPUT: <IntlMessages id='sidebar.sample.inputs' />,
    OUTPUT: <IntlMessages id='sidebar.sample.outputs' />,
  },
  BILLS: {
    CANCELLED: <IntlMessages id='bill.canceled.yes' />,
    NOCANCELLED: <IntlMessages id='bill.canceled.no' />,
  },
  PAYMENTS: {
    TOPAID: <IntlMessages id='finance.status.expense.toPaid' />,
    PAID: <IntlMessages id='finance.status.expense.paid' />,
    ADVANCE: <IntlMessages id='finance.status.expense.advance' />,
  },
  PURCHASETYPE: {
    CREDIT: <IntlMessages id='finance.purchase.type.credit' />,
    CASH: <IntlMessages id='finance.purchase.type.cash' />,
  },
  PAYMENTMETHOD: {
    CASH: <IntlMessages id='payment.method.cash' />,
    DEBIT: <IntlMessages id='payment.method.debit' />,
    CREDIT: <IntlMessages id='payment.method.credit' />,
    BANKTRANSFER: <IntlMessages id='common.bankTransfer' />,
    BANKDEPOSIT: <IntlMessages id='common.bankDeposit' />,
    YAPE: <IntlMessages id='payment.method.yape' />,
    PLIN: <IntlMessages id='payment.method.plin' />,
    CARD: <IntlMessages id='payment.method.card' />,
    GIFTCARD: <IntlMessages id='payment.method.giftCard' />,
  },
  CONCEPTACTION: {
    SUBTRACT: <IntlMessages id='otherPayConcept.action.subtract' />,
    ADD: <IntlMessages id='otherPayConcept.action.add' />,
  },
  DOCUMENTTYPE: {
    QUOTATION: <IntlMessages id='document.type.quotation' />,
    BILL: <IntlMessages id='document.type.bill' />,
    RECEIPT: <IntlMessages id='document.type.receipt' />,
    REFERRALGUIDE: <IntlMessages id='document.type.referralGuide' />,
    ANYONE: <IntlMessages id='document.type.anyone' />,
    CREDITNOTE: <IntlMessages id='document.type.creditNote' />,
    DEBITNOTE: <IntlMessages id='document.type.debitNote' />,
    TICKET: <IntlMessages id='document.type.sellticket' />,
  },
  DOCUMENTCANCELSTATUS: {
    YES: <IntlMessages id='document.cancelStatus.true' />,
    NO: <IntlMessages id='document.cancelStatus.false' />,
  },
  PROOFOFPAYMENTPAYSTATUS: {
    BILL: <IntlMessages id='finance.proofOfPayment.type.bill.payStatus' />,
    RECEIPT: (
      <IntlMessages id='finance.proofOfPayment.type.receipt.payStatus' />
    ),
    TICKET: <IntlMessages id='finance.proofOfPayment.type.ticket.payStatus' />,
  },
  PROOFOFPAYMENTTOTALAMOUNT: {
    BILL: <IntlMessages id='finance.proofOfPayment.type.bill.totalAmount' />,
    RECEIPT: (
      <IntlMessages id='finance.proofOfPayment.type.receipt.totalAmount' />
    ),
    TICKET: (
      <IntlMessages id='finance.proofOfPayment.type.ticket.totalAmount' />
    ),
  },
  PROOFOFPAYMENTNUMBER: {
    BILL: <IntlMessages id='finance.proofOfPayment.type.bill.number' />,
    RECEIPT: <IntlMessages id='finance.proofOfPayment.type.receipt.number' />,
    TICKET: <IntlMessages id='finance.proofOfPayment.type.ticket.number' />,
  },
  PROOFOFPAYMENTDATE: {
    BILL: <IntlMessages id='finance.proofOfPayment.type.bill.date' />,
    RECEIPT: <IntlMessages id='finance.proofOfPayment.type.receipt.date' />,
    TICKET: <IntlMessages id='finance.proofOfPayment.type.ticket.date' />,
  },
  SUBTYPENOTE: {
    operationCancellation: (
      <IntlMessages id='subtype.note.operationCancellation' />
    ),
    cancellationDueToErrorInTheRuc: (
      <IntlMessages id='subtype.note.cancellationDueToErrorInTheRuc' />
    ),
    correctionForErrorInTheDescription: (
      <IntlMessages id='subtype.note.correctionForErrorInTheDescription' />
    ),
    overallDiscount: <IntlMessages id='subtype.note.overallDiscount' />,
    discountPerItem: <IntlMessages id='subtype.note.discountPerItem' />,
    totalRefund: <IntlMessages id='subtype.note.totalRefund' />,
    returnPerItem: <IntlMessages id='subtype.note.returnPerItem' />,
    bonus: <IntlMessages id='subtype.note.bonus' />,
    decreaseInValue: <IntlMessages id='subtype.note.decreaseInValue' />,
    otherConcepts: <IntlMessages id='subtype.note.otherConcepts' />,
    adjustmentsOfCreditNoteAffectedByIVAP: (
      <IntlMessages id='subtype.note.adjustmentsOfCreditNoteAffectedByIVAP' />
    ),
    exportOperationsAdjustmentsOfCreditNote: (
      <IntlMessages id='subtype.note.exportOperationsAdjustmentsOfCreditNote' />
    ),
    adjusmentsOfAmountsAndOrPaymentDates: (
      <IntlMessages id='subtype.note.adjusmentsOfAmountsAndOrPaymentDates' />
    ),
    interestForLatePayment: (
      <IntlMessages id='subtype.note.interestForLatePayment' />
    ),
    increaseInValue: <IntlMessages id='subtype.note.increaseInValue' />,
    penalties: <IntlMessages id='subtype.note.penalties' />,
    adjustmentsOfDebitNoteAffectedByIVAP: (
      <IntlMessages id='subtype.note.adjustmentsOfDebitNoteAffectedByIVAP' />
    ),
    exportOperationsAdjustmentsOfDebitNote: (
      <IntlMessages id='subtype.note.exportOperationsAdjustmentsOfDebitNote' />
    ),
  },
};
