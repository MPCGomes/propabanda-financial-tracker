export function formatCurrency(n: number): string {
  return `R$ ${n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;
}
