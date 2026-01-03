export class Formatter {
  static currency(price: number) {
    return new Intl.NumberFormat("es-MX", {
      currency: "MXN",
      style: "currency",
      minimumFractionDigits: 2,
    }).format(price);
  }
}
