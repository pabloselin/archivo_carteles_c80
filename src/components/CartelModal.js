import React from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";

const ModalData = (props) => {
	return (
		<div className="row">
			<div className="data col">
				<img src={props.data.image} />
				<div className="ficha">
					<div className="datasection">
						<strong>
							ID {props.data.shortcode}
							<a
								target="_blank"
								href={`https://instagram.com/p/${props.data.shortcode}`}
							>
								{" "}
								<i className="fa fa-link"></i>
							</a>
						</strong>
						<p>
							Publicada el {props.data.date} por @chile_carteles
						</p>
					</div>
					<div className="datasection">
						<strong>Texto detectado</strong>
						{props.data.words.map((word, idx) => (
							<span className="detectedword" key={idx}>
								{word}
							</span>
						))}
					</div>
					<div className="datasection">
						<strong>Objetos Detectados</strong>
						{props.data.objects.join(", ")}
					</div>
					<div className="datasection">
						<strong>Etiquetas</strong>{" "}
						{props.data.labels.join(", ")}
					</div>
					{/* {props.data.comments && (
						<div className="datasection">
							<strong>Comentarios</strong>
							{props.data.comments
								.split(";")
								.map((comment, idx) => (
									<p key={idx}>{comment}</p>
								))}
						</div>
					)} */}
					<div className="datasection">
						<strong>Autoría</strong>
						<p class="disclaimer">Si quieres contarnos a quien pertenece esta imagen o bajarla haz <a href="https://forms.gle/KmhbY6bMwEymv9aZ6">click aquí</a>.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const CartelModal = (props) => {
	if (props.data.comments) {
		console.log(props.data.comments.split(";"));
	}

	return (
		<>
			{props.data.modal == true ? (
				<>
					<div className="modal-overlay"></div>
					<div className="modal archivo-carteles-modal" tabIndex="-1">
						<Helmet>
							<script>
								document.body.style.overflow = "hidden";
							</script>
						</Helmet>

						<div className="modal-dialog modal-xl modal-fullscreen-sm-down">
							<div className="modal-content">
								<div className="modal-header">
									<button
										type="button"
										className="btn-close"
										data-bs-dismiss="modal"
										aria-label="Cerrar"
									></button>
								</div>
								<div className="modal-body">
									<div className="container">
										{props.data.type == "info" ? (
											<ModalData data={props.data} />
										) : (
											<div className="row about-modal" class="sobre-el">
												<div className="col-12">
													<h5>Estas imágenes fueron descargadas con fines únicamente educacionales y de investigación. No pertenecen a quienes desarrollaron esta plataforma.
														Si alguna imagen te pertenece y quisieras solicitar que se elimine de este archivo, 
														puedes rellenar este <a href="https://forms.gle/KmhbY6bMwEymv9aZ6">formulario</a>.
													</h5>
													<h2>Sobre el proyecto</h2>
													<p>
														La herramienta
														diferenciadora de este
														proyecto es el algoritmo
														de visión por computador 
														<a href="https://cloud.google.com/vision"> (Google Cloud Vision
														API)</a> que usa modelos de
														inteligencia artificial
														previamente entrenados
														con millones de imágenes
														para interpretar texto,
														detectar objetos,
														colores, aplicar
														etiquetas, entre otros. La velocidad
														de procesamiento la hace
														especialmente útil para
														poder organizar grandes
														repositorios.
													</p>
													<p>
														Este servicio cuenta con
														varios algoritmos para
														procesar imágenes. El
														más relevante para este
														proyecto es el
														reconocimiento óptico de
														caracteres o "OCR" por sus
														siglas en inglés. Esta
														tecnología se empezó a
														desarrollar en el año
														1914, pero tomó fuerza a
														principios de los 70
														como una solución para
														personas con baja o nula
														visión. Hoy se utiliza
														en múltiples
														aplicaciones, como la
														lectura de patentes en
														las autopistas o lectura de documentos como cheques o pasaportes.
													</p>
													<p>
														En muchas de las
														imágenes recopiladas y
														lo que se observaba en
														las ciudades no era solo
														texto. Se produjo una
														riqueza visual
														particular de objetos
														simbólicos del
														movimiento. Para eso,
														también se utilizaron
														algoritmos para detectar
														objetos y etiquetar las
														imágenes. La
														localización de objetos
														consiste en identificar
														información sobre uno o
														más objetos contenidos
														en una imagen.
													</p>
													<p>
													Por último, el archivo fue analizado para extraer entidades
													de las imágenes y asignar etiquetas. Éstas pueden identificar locaciones, 
													actividades, animales, productos, entre otros. Es así que este archivo
														C80 sobre imágenes en
														Instagram de la revuelta
														social 2019-2020 permite ser observado y categorizado con la ayuda de la inteligencia artificial.
													</p>
													<h2>Créditos</h2>
													<p>
														Este archivo fue
														realizado como proyecto
														de tesis de magíster de
														 <a href="https://karinahy.com/"> Karina Hyland</a> en el
														programa Interactive
														Telecommunications de
														NYU (New York
														University) en mayo de
														2020.{" "}
													</p>
													<p>
														Desarrollado en <a href="https://c80.cl/"> C80.cl </a> 
														gracias al Fondart Nacional línea
														diseño, adjudicado en
														2021 [folio: 630870].
													</p>
													<p>
														El equipo 2022 de C80
														está compuesto por:
														Ricardo Vega, Daniela
														Moyano, Jorge Loayza (A
														Pie), Pablo S. Carrasco
														(A Pie), María Paz
														Maureira (A Pie), Karina
														Hyland y Ernesto Riffo,
														más otros colaboradores.
													</p>
													<h2>Agradecimientos</h2>
													<p>
														A todas y todos quienes
														subieron a Instagram
														imágenes de las calles
														durante la revuelta de
														2019 y en especial a
														@chile_carteles por
														juntarlas todas y
														permitir este proyecto.{" "}
													</p>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<Helmet>
						<script>document.body.style.overflow = "auto";</script>
					</Helmet>
				</>
			)}
		</>
	);
};

const modalDiv = document.getElementById("react-modal-data");
const root = createRoot(modalDiv);

// if (modalDiv) {
// 	console.log(window.currentData);

// }

const RenderCartelModal = (props) => {
	root.render(<CartelModal data={props} />);
};

export default RenderCartelModal;
