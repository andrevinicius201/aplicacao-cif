import { PdfMakeWrapper, Txt, Columns, Stack, Table, Cell, Canvas, Line, Img, Ul } from 'pdfmake-wrapper';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Evaluation } from '../interfaces/evaluation';
import { Questions } from '../interfaces/questions';
import { Content } from '@angular/compiler/src/render3/r3_ast';

export class Gerador {
    static arraylist: any[] = [["PERG1","PERG2","PERG3","PERG4"], ["TESTE2", "TESTE3", "TESTE4"]];


    static async geradorPDF(evaluation: Evaluation, questions:Questions) {
        PdfMakeWrapper.setFonts(pdfFonts);
        const pdf = new PdfMakeWrapper();
        const title = new Txt("Avaliação de Funcionalidade")
            .alignment("center")
            .bold()
            .color("#979797")
            .fontSize(24)
            .end;

        pdf.add(title);
        pdf.add(pdf.ln(2));

        pdf.add(
            new Canvas([
                new Line([0, 0], [500, 0]).color("#979797").end
            ]).end
        );
        pdf.add(pdf.ln(1));
        pdf.add(
            new Table([
                [
                    new Txt([new Txt('Paciente: ').bold().end, localStorage.getItem('name')]).end,
                    new Txt([new Txt('Data: ').bold().end, new Date().toLocaleString()]).end,
                ],
                [
                    new Txt([new Txt('Terapeuta: ').bold().end, localStorage.getItem('name')]).end,
                    new Txt([new Txt('Local: ').bold().end, 'Guarulhos']).end,
                ]
            ]).widths('*').layout("noBorders").end
        );
        pdf.add(pdf.ln(1));
        pdf.add(
            new Canvas([
                new Line([0, 0], [500, 0]).color("#979797").end
            ]).end
        );
        pdf.add(pdf.ln(2));
        pdf.add(
            new Txt("FATORES AMBIENTAIS")
            .alignment("left")
            .bold()
            .color("#979797")
            .fontSize(18)
            .end
        )
        pdf.add(
            new Table([
                
                    this.arraylist
                
            ]).width(500).end
        )
        
        pdf.pageSize('A4');
        pdf.create().open();
    }

    static buildQuestions(){
        for (let index = 0; index < this.arraylist.length; index++) {
            new Txt(this.arraylist[index]).end;
        }
    }
}