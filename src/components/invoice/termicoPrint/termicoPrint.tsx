import { RefObject, useMemo, useRef } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import Order from "@/models/order";
import { formatDate } from "@/components/invoice/printOrder/printOrder";

const formatNumber = (num: number) => {
	const [integerPart, decimalPart] = num.toFixed(2).split(".");
	return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function TermicoPrint({ order }: { order: Order }) {
	const IVA_RATE = 0.19;

	// Dentro de tu componente
	const costSummary = useMemo(() => {
		if (!order.costos) return { cost: 0, iva: 0, totalCost: 0 };

		// Sumar todos los 'costo' del array
		const cost = order.costos.reduce((acc, curr) => {
			const currentCost = parseFloat(curr.costo) || 0; // Asegurarse de que el costo sea un número
			return acc + currentCost;
		}, 0);

		// Calcular IVA y total
		const iva = cost * IVA_RATE;
		const totalCost = cost + iva;

		return {
			cost: formatNumber(cost),
			iva: formatNumber(iva),
			totalCost: formatNumber(totalCost),
		};
	}, [order.costos]);

	return (
		<>
			<div className={styles.printOrderMainBox}>
				<section>
					<div className={styles.business}>
						<Image
							width={100}
							height={100}
							alt="Heat Electronics logo"
							src={"/print logo.png"}
						/>
						<h2>Heat Electronics</h2>
					</div>
					<div className={styles.dataBox}>
						<div className={styles.dataHeader}>
							<span>#Orden</span>
						</div>
						<ul className={styles.ul}>
							<li>
								<span>#{order.customId || "Null"}</span>
							</li>
							<li>
								<span>{formatDate(order.createdAt as unknown as string)}</span>
							</li>
						</ul>
					</div>
				</section>
				<section className={styles.section2}>
					<div className={styles.dataBox}>
						<div className={styles.dataHeader}>Negocio</div>
						<ul className={styles.ul}>
							<li>
								<span>Nombre:</span> Heat Electronics
							</li>
							<li>
								<span>Teléfono:</span> +56 922102147
							</li>
							<li>
								<span>Dirección:</span> Quilpue, Region de Valparaiso
							</li>
						</ul>
					</div>
					<div className={styles.dataBox}>
						<div className={styles.dataHeader}>Cliente</div>
						<ul className={styles.ul}>
							<li>
								<span>Nombre:</span> {order.cliente.fullName}
							</li>
							<li>
								<span>Teléfono:</span> {order.cliente.numero}
							</li>
							<li>
								<span>Correo:</span> {order.cliente.correo}
							</li>
							<li>
								<span>Numero de Identificación:</span> {order.cliente.id}
							</li>
							<li>
								<span>Dirección:</span> {order.cliente.direccion}
							</li>
						</ul>
					</div>
				</section>
				<section className={styles.section3}>
					<div className={styles.dataBox}>
						<div className={styles.dataHeader}>Datos del equipo</div>
						<ul className={styles.ul}>
							<li>
								<span>Marca:</span> {order.marca}
							</li>
							<li>
								<span>Modelo:</span> {order.modelo}
							</li>
							<li>
								<span>Tipo:</span> {order.tipo}
							</li>
							<li>
								<span>Numero de serie:</span> {order.numeroDeSerie}
							</li>
							<li>
								<span>Observaciones:</span> {order.observacion}
							</li>
						</ul>
					</div>
					<div className={styles.dataBox}>
						<div className={styles.dataHeader}>Costos</div>
						<table>
							<thead>
								<tr>
									<th>Nota</th>
									<th>Costo</th>
								</tr>
							</thead>
							<tbody>
								{order.costos?.map((item, index) => (
									<tr key={index}>
										<td>{item.nombre}</td>
										<td className={styles.costBoxRight}>
											$ {formatNumber(parseFloat(item.costo))}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<p className={styles.garantiaBox}>
						Garantia: {order.garantia || 3} Meses
						<p className={styles.deliveredDate}>
							{formatDate(order.deliveredAt as unknown as string)}
						</p>
					</p>
				</section>
				<section>
					<div className={styles.totalCostBox}>
						<div className={styles.costBox}>
							<div className={styles.costBoxLeft}>Subtotal</div>
							<div className={styles.costBoxRight}>$ {costSummary.cost}</div>
						</div>
						<div className={styles.costBox}>
							<div className={styles.costBoxLeft}>Impuesto%</div>
							<div className={styles.costBoxRight}>$ {costSummary.iva}</div>
						</div>
						<div className={styles.costBox}>
							<div className={styles.costBoxLeft}>TOTAL</div>
							<div className={styles.costBoxRight}>
								$ {costSummary.totalCost}
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
