const PDFDocument = require('pdfkit');
const axios = require("axios");

exports.buildPDF = async (dataCallback, endCallback, assignment) => {
  const doc = new PDFDocument({ bufferPages: true, size: "A4", margin: 50 });

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  const url = "https://www.organisatielotus.nl/wp-content/uploads/2018/10/LOTUS_Logo_10_2018-e1543227820406.jpg"

  async function fetchImage(src) {
    const image = await axios
      .get(src, {
          responseType: 'arraybuffer'
      })
    return image.data;
  }

  const logo = await fetchImage(url);

  generateHeader(doc, logo);
  generatePersonalInfo(doc, assignment);
  generateAssignmentData(doc, assignment);
  generateExtraData(doc, assignment);
  generateFooter(doc, assignment);
  doc.end();

  return doc;
}

function generatePersonalInfo(doc, assignment) {
  doc
    .fillColor("#444444")
    .fontSize(14)
    .text("Persoonlijke gegevens", 50, 160);

  generateHr(doc, 185);

  const personalInfoTop = 200;

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Volledige naam:", 50, personalInfoTop)
    .font("Helvetica")
    .text(assignment.firstName + " " + assignment.lastName, 200, personalInfoTop)
    .font("Helvetica-Bold")
    .text("E-mailadres", 50, personalInfoTop + 15)
    .font("Helvetica")
    .text(assignment.emailAddress, 200, personalInfoTop + 15)
    .moveDown();
}

function generateAssignmentData(doc, assignment) {
  doc
    .fillColor("#444444")
    .fontSize(14)
    .text("Opdrachtgegevens", 50, 260);

  generateHr(doc, 285);

  const assignmentDataInfo = 300;

  if (assignment.makeUpHouseNumber || assignment.makeUpHouseNumberAddition || assignment.makeUpPostalCode || assignment.makeUpTown) {
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Speelplaats adres: ", 50, assignmentDataInfo)
      .font("Helvetica")
      .text(assignment.playgroundStreet + " " + assignment.playgroundHouseNumber + assignment.playgroundHouseNumberAddition + ", " + assignment.playgroundPostalCode + " " + assignment.playgroundTown.toUpperCase(), 200, assignmentDataInfo )
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Grimeer adres: ", 50, assignmentDataInfo + 15)
      .font("Helvetica")
      .text(assignment.makeUpStreet + " " + assignment.makeUpHouseNumber + assignment.makeUpHouseNumberAddition + ", " + assignment.makeUpPostalCode + " " + assignment.makeUpTown.toUpperCase(), 200, assignmentDataInfo + 15)
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Datum/tijd: ", 50, assignmentDataInfo + 30)
      .font("Helvetica")
      .text(formatDate(new Date(assignment.dateTime)), 200, assignmentDataInfo + 30)
      .moveDown()
  } else {
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Speelplaats adres: ", 50, assignmentDataInfo)
      .font("Helvetica")
      .text(assignment.playgroundStreet + " " + assignment.playgroundHouseNumber + assignment.playgroundHouseNumberAddition + ", " + assignment.playgroundPostalCode + " " + assignment.playgroundTown.toUpperCase(), 200, assignmentDataInfo)
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Datum/tijd: ", 50, assignmentDataInfo + 15)
      .font("Helvetica")
      .text(formatDate(new Date(assignment.dateTime)), 200, assignmentDataInfo + 15)
      .moveDown()
  }
}

function generateExtraData(doc, assignment) {
  doc
    .fillColor("#444444")
    .fontSize(14)
    .text("Overig", 50, 375);

  generateHr(doc, 400);

  const extraDataInfo = 415;

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Aantal gereden kilometers: ", 50, extraDataInfo)
    .font("Helvetica")
    .text("___________ km", 200, extraDataInfo)
    .moveDown()
    
  if (assignment.comments) {
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Opmerkingen: ", 50, extraDataInfo + 15)
      .font("Helvetica")
      .text("__________________________________________________________________________________________________________________________________________________________________________________________", 200, extraDataInfo + 15)
      .moveDown();
  }
}

function generateHeader(doc, logo) {
	doc
    .image(logo, 50, 45, { width: 50 })
		.fontSize(16)
    .font("Helvetica")
		.text("LOTUS-Kring Here We Go", 110, 65)
		.fontSize(10)
		.text('Hooiakker 6', 200, 65, { align: 'right' })
		.text('Rijen, 5122HZ', 200, 80, { align: 'right' })
		.moveDown();
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatDate(inputDate) {
  let date, month, year, hour, minute;

  date = inputDate.getDate();
  month = inputDate.getMonth() + 1;
  year = inputDate.getFullYear();
  hour = inputDate.getHours();
  minute = inputDate.getMinutes();

  date = date.toString().padStart(2, "0");

  month = month.toString().padStart(2, "0");

  if(minute < 10) {
    minute = "0" + minute;
  }

  return `${date}/${month}/${year} ${hour}:${minute}`;
}

function generateFooter(doc, assignment) {
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Handtekening opdrachtgever:", 50, 525)
    .font("Helvetica")
    .text("________________________", 50, 570)
    .font("Helvetica-Oblique")
    .text(assignment.firstName + " " + assignment.lastName, 50, 590)

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Handtekening LOTUSslachtoffer:", 260, 525)
    .font("Helvetica")
    .text("_____________________________", 260, 570)
    .font("Helvetica-Oblique")
    .text(assignment.user.firstName + " " + assignment.user.lastName, 260, 590)
}