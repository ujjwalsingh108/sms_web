declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  interface UserOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    theme?: "striped" | "grid" | "plain";
    styles?: any;
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    columnStyles?: any;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    didDrawPage?: (data: any) => void;
    didDrawCell?: (data: any) => void;
    [key: string]: any;
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): void;
}
