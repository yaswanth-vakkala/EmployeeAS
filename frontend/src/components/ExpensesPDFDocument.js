import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
  },
  section: {
    margin: 0,
    padding: 0,
    flexGrow: 1,
  },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
  },
});

function formatTime(avgHours) {
  let days = Math.floor(avgHours / 24);
  let remainder = avgHours % 24;
  let hours = Math.floor(remainder);
  let minutes = Math.floor(60 * (remainder - hours));
  return days + ' days ' + hours + ' hours ' + minutes + ' minutes';
}

const ExpensesPDFDocument = ({ report, sdate, edate, empName, empId }) => {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    // style: 'currency',
    currency: 'INR',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <Text style={styles.title}>
          Expense Report for selected time period
        </Text>
        <Text style={styles.header}>Start Date: {sdate}</Text>
        <Text style={styles.header}>End Date: {edate}</Text>

        <Text style={styles.text}>
          Total no of Expenses received during the selected time period:{' '}
          {Number(report.data.report1[0].count) +
            Number(report.data.report2[0].count)}
        </Text>
        <Text style={styles.text}>
          Total no of Expenses reimbursed during the selected time period:{' '}
          {Number(report.data.report1[0].count)}
        </Text>
        <Text style={styles.text}>
          Total no of Expenses Rejected or In Process during the selected time
          period: {Number(report.data.report2[0].count)}
        </Text>
        <Text style={styles.text}>
          Total cost of Expenses submitted during the selected time period:{' '}
          {currencyFormatter.format(
            Number(report.data.report1[0].totalExpenseCost) +
              Number(report.data.report2[0].totalExpenseCost)
          )}{' '}
          rupees
        </Text>
        <Text style={styles.text}>
          Total cost of Expenses Reimbursed during the selected time period:{' '}
          {currencyFormatter.format(
            Number(report.data.report1[0].totalExpenseCost)
          )}{' '}
          rupees
        </Text>
        <Text style={styles.text}>
          Total cost of Expenses Rejected or In Process during the selected time
          period:{' '}
          {currencyFormatter.format(
            Number(report.data.report2[0].totalExpenseCost)
          )}{' '}
          rupees
        </Text>
        <Text style={styles.text}>
          {' '}
          Average Reimbursement time calculated based on only reimbursed
          expenses during the selected time period:{' '}
          {formatTime(Number(report.data.report3[0].avgTime))}
        </Text>
        <Text style={styles.text}>
          Average Processing time calculated based on reimbursed and Rejected
          expenses during the selected time period:{' '}
          {formatTime(Number(report.data.report4[0].avgTime))}
        </Text>
        <Text style={styles.text}>
          generated by {empName} (Employee Id: {empId})
        </Text>
      </Page>
    </Document>
  );
};

export default ExpensesPDFDocument;