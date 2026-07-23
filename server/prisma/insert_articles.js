const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Inserting study materials and rules into Content database...');

  // Check if they already exist to avoid duplicate inserts
  const existingTaekwondo = await prisma.content.findFirst({
    where: { titulo: 'Guía Oficial de Estudio: Cinturón Blanco a Verde' }
  });

  if (!existingTaekwondo) {
    await prisma.content.create({
      data: {
        titulo: 'Guía Oficial de Estudio: Cinturón Blanco a Verde',
        categoria: 'TECNICA',
        resumen: 'Temario oficial de evaluación teórica y técnica para el ascenso de grados en Taekwondo, incluyendo vocabulario coreano, posiciones, ataques y defensa personal (Ho Sin Sul).',
        cuerpo: `FILOSOFÍA INSTITUCIONAL Y EVALUACIÓN\n` +
          `El proceso de ascenso de grado representa un hito fundamental en el desarrollo del estudiante. La evaluación constituye el primer requisito para el ascenso de cinturón. La evaluación teórica se realiza de manera oral sobre los temas de esta guía, mientras que la práctica evalúa la asistencia constante, la participación activa en los entrenamientos y el dominio técnico.\n\n` +
          `SIGNIFICADO DE LOS CINTURONES\n` +
          `- Cinturón Blanco (Jin-Ti): Representa la inocencia del estudiante principiante que no posee conocimientos previos. Es el lienzo en blanco, la semilla bajo la tierra esperando brotar.\n` +
          `- Cinturón Amarillo (Norang-Ti): Representa la tierra, el descubrimiento y el realismo (comienza a ver la luz). Simboliza el inicio del aprendizaje, el nacimiento y las riquezas físicas y espirituales obtenidas con la práctica.\n` +
          `- Cinturón Verde (Pol-Ti): Representa el desarrollo de habilidades y el crecimiento. Simboliza la naturaleza, el vigor de la vida en crecimiento y la sabia búsqueda de lo que está más alto.\n\n` +
          `PRINCIPIOS DEL TAEKWONDO y REGLAS DEL BUEN DEPORTISTA\n` +
          `1. Cortesía (Ye Ui): Ser amable, humilde y respetar a los demás, especialmente a mayores y superiores.\n` +
          `2. Integridad (Yom Chi): Saber distinguir lo correcto de lo incorrecto y admitir los errores.\n` +
          `3. Perseverancia (In Nae): No rendirse ante las dificultades para alcanzar el éxito.\n` +
          `4. Autocontrol (Guk Gi): Dominar las emociones y acciones, manteniendo la calma.\n` +
          `5. Espíritu Indomable (Baekjul Boolgool): Mantener el valor y la convicción ante la injusticia o el miedo.\n` +
          `Reglas: Cuidar la higiene, dormir 8 horas, comer a la misma hora, y decir NO a las drogas, alcohol y tabaco.\n\n` +
          `VOCABULARIO TÉCNICO BÁSICO\n` +
          `- Charyot: Firmes\n` +
          `- Kyon Ye: Saludo\n` +
          `- Kuk Ki: Bandera\n` +
          `- Sa Bom Nim: Profesor\n` +
          `- Si Chak: Comenzar\n` +
          `- Chumbi: Listos\n` +
          `- Ku Man: Finalizar\n` +
          `- Duidora / Dui Ro Dora: Media vuelta\n` +
          `- Conteo: Hanna (1), Dul (2), Seet (3), Neet (4), Dasot (5), Yasot (6), Ilgop (7), Yodul (8), Ahop (9), Yol (10).\n\n` +
          `GLOSARIO DE POSICIONES (SOGUI)\n` +
          `- Chariot Sogui (Posición de firmes)\n` +
          `- Pionji Sogui / Kibom Chumbi (Posición de las formas / listos)\n` +
          `- Ap Sogui (Posición corta)\n` +
          `- Ap Cubi (Posición larga)\n` +
          `- Chuchum Sogui (Posición del jinete)\n` +
          `- Kyorugui Sogui / Chumbi Sogui (Posición de combate)\n` +
          `- Dwit Cubi (Posición corta con pies cambiados)\n` +
          `- Orun / Wen Sogui (Posición en L a la derecha / izquierda)\n\n` +
          `GLOSARIO DE ATAQUES (JIRUGUI)\n` +
          `- Are Jirugui (Ataque bajo)\n` +
          `- Montong Jirugui (Ataque medio)\n` +
          `- Olgul Jirugui (Ataque alto)\n` +
          `- Dubon Jirugui (Ataque de puño doble)\n` +
          `- Sonnal Mok Chigi (Ataque al cuello con mano abierta)\n` +
          `- Pionson Kut Seuo Chirugui (Ataque con punta de los dedos)\n\n` +
          `GLOSARIO DE BLOQUEOS (MAKKI)\n` +
          `- Are Maqui (Bloqueo bajo)\n` +
          `- Montong Maqui (Bloqueo medio)\n` +
          `- Olgul Maqui (Bloqueo alto)\n` +
          `- Montong Bakkat Maqui (Bloqueo medio hacia fuera con mano cerrada)\n` +
          `- Sonnal Montong Maqui (Doble bloqueo hacia fuera con manos abiertas)\n\n` +
          `GLOSARIO DE PATADAS (CHAGUI)\n` +
          `- Ap Chagui: Patada de frente con la bola del pie.\n` +
          `- Bandal Chagui: Patada con el empeine hacia los costados.\n` +
          `- Dollyo Chagui: Patada con el empeine hacia la cara.\n` +
          `- Chigo Chagui: Patada descendente hacia la cara.\n` +
          `- Yop Chagui / Yod Chagui: Patada lateral.\n` +
          `- Dui Chagui: Patada de media vuelta.\n\n` +
          `SIGNIFICADO DE POOMSAES (TAEGUK)\n` +
          `- Poomsae 1 (Taeguk Il Jang): 18 movimientos. Significa Cielo y Luz (Keon). Simboliza el comienzo de la creación de las cosas.\n` +
          `- Poomsae 2 (Taeguk I Jang): 18 movimientos. Significa Alegría y Júbilo (Tae). Simboliza la firmeza interior y suavidad exterior (lago).\n` +
          `- Poomsae 3 (Taeguk Sam Jang): 20 movimientos. Significa Fuego y Sol (Ri). Fomentar el sentido de justicia y fervor.\n` +
          `- Poomsae 4 (Taeguk Sah Jang): 20 movimientos. Significa Trueno y Rayo (Jin). Gran poder y dignidad.\n` +
          `- Poomsae 5 (Taeguk Oh Jang): 20 movimientos. Significa Viento (Son). Poderoso pero flexible.\n` +
          `- Poomsae 6 (Taeguk Yuk Jang): 23 movimientos. Significa Agua (Kam). Flujo incesante y suavidad.\n\n` +
          `DEFENSA PERSONAL (HO SIN SUL)\n` +
          `La defensa personal no se trata de fuerza bruta, sino de técnica, distancia y aprovechamiento de la fuerza del oponente.\n` +
          `- Tres Pilares: Distancia de Reacción (zona de peligro), Ley de la Palanca (escapar de agarres girando la muñeca), Centro de Gravedad (Kuzushi - romper el equilibrio).\n` +
          `- Herramientas a corta distancia: Palkup (codo), Murup (rodilla), Batangson (palma de la mano).\n` +
          `- Enfoque Psicológico: 1. Evitar (prevención); 2. Escapar (crear oportunidad de huida); 3. Entregar (aplicar técnica con Espíritu Indomable).`,
        imagenUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
        fechaPublicacion: new Date().toISOString().split('T')[0]
      }
    });
    console.log('Added: Guía Oficial de Estudio: Cinturón Blanco a Verde');
  } else {
    console.log('Skipped: Taekwondo study guide already exists');
  }

  const existingWako = await prisma.content.findFirst({
    where: { titulo: 'Reglamento de Competición Oficial WAKO 2026' }
  });

  if (!existingWako) {
    await prisma.content.create({
      data: {
        titulo: 'Reglamento de Competición Oficial WAKO 2026',
        categoria: 'REGLAMENTO',
        resumen: 'Reglamento unificado completo de Kickboxing WAKO. Conoce las modalidades oficiales de Tatami y Ring, equipo obligatorio, puntuación y código de conducta.',
        cuerpo: `MODALIDADES DE COMPETICIÓN WAKO\n` +
          `El Kickboxing competitivo se divide en dos grandes áreas:\n` +
          `1. Modalidades de Tatami:\n` +
          `   - Point Fighting (PF): Combate de interrupción por puntos tras cada golpe válido.\n` +
          `   - Light Contact (LC): Combate continuo con potencia controlada.\n` +
          `   - Kick Light (KL): Light Contact que incluye patadas al muslo (low kicks).\n` +
          `   - Formas Musicales (FM) y Creativas (CF): Ejecución de técnicas simulando pelea con oponente imaginario, con o sin música, y con o sin armas.\n` +
          `2. Modalidades de Ring:\n` +
          `   - Full Contact (FC): Combate continuo con KO permitido, golpes sobre la cintura.\n` +
          `   - Low Kick (LK): Combate continuo con KO permitido, incluye patadas a las piernas.\n` +
          `   - K1 Styles: Incluye golpes de rodilla y agarres activos cortos.\n\n` +
          `CATEGORÍAS POR EDAD Y MODALIDADES PERMITIDAS\n` +
          `- Infantil (7, 8, 9 años): Formas Musicales (MF) y Point Fighting (PF).\n` +
          `- Cadetes Menores (10, 11, 12 años): Formas Musicales (MF) y Point Fighting (PF).\n` +
          `- Cadetes Mayores (13, 14, 15 años): MF, PF, Light Contact (LC), Kick Light (KL).\n` +
          `- Junior (16, 17, 18 años): MF, PF, LC, KL, Full Contact (FC), Low Kick (LK), K1 Styles.\n` +
          `- Senior (19 a 40 años): MF, PF, LC, KL, FC, LK, K1.\n` +
          `- Master (41 a 55 años): PF, LC, KL.\n\n` +
          `INDUMENTARIA Y EQUIPO DE PROTECCIÓN OBLIGATORIO\n` +
          `- Point Fighting: Casco con mascarilla (5-12 años), protector bucal (obligatorio desde 13 años), guantes abiertos, coquilla/protector inguinal, espinilleras (sin empeine), zapatones. Vendas opcionales en menores de 13 años.\n` +
          `- Light Contact: Casco, bucal, top deportivo (busto para mujeres), vendas de manos, guantes de boxeo de 10oz, protector de genitales/ingle, espinilleras (sin plástico duro), zapatones. Prohibido fajas o cinturones.\n` +
          `- Kick Light: Cabezal, bucal, camiseta sin mangas, guantes 10oz, pantaloneta, vendas obligatorias, protector inguinal, espinilleras, zapatones.\n` +
          `- Ring (FC, LK, K1): Cabezal sin pómulos, guantes 10oz, vendas de manos, protector bucal, pechera (mujeres), protector inguinal (hombres y mujeres), espinilleras de velcro/cierre mágico (en LK/K1), zapatones (en FC).\n` +
          `- Formas: Vestimenta tradicional o de kickboxing sin logos. Armas permitidas (no afiladas): Katana, Sai cromados, Tonfa, Bastones de Escrima, Bo, Nunchaku, Kamas. Tiempo: Mínimo 1 minuto, Máximo 3 minutos.\n\n` +
          `SISTEMA Y CRITERIO DE PUNTUACIÓN\n` +
          `- Tatami: Se valora técnica válida, zona válida, contundencia controlada y equilibrio/distancia.\n` +
          `- Ring: Se valora técnica válida, zona válida, contundencia plena y terminación (equilibrio y balance).\n` +
          `- Puntos por Técnica (Tatami y Ring en tatami):\n` +
          `  * Golpe de puño: 1 punto.\n` +
          `  * Patada al cuerpo (incluyendo girando): 1 punto. (Patada al muslo solo en KL: 1 punto).\n` +
          `  * Barrida de pie: 1 punto (cuenta si provoca que el oponente toque el piso con cualquier parte del cuerpo distinta a los pies).\n` +
          `  * Patada a la cabeza: 2 puntos.\n` +
          `  * Patada saltando al cuerpo: 2 puntos.\n` +
          `  * Patada saltando a la cabeza: 3 puntos.\n` +
          `- Regla especial en Ring: ¡Todas las técnicas valen 1 punto!\n\n` +
          `FALTAS, PENALIZACIONES Y ADVERTENCIAS (Art 1.14)\n` +
          `- Menos 1 punto: Dejar caer el arma, cambiar de arma, técnicas no permitidas en Formas.\n` +
          `- Menos 0.5 puntos: Más de 5 movimientos gimnásticos, caída de cinturón al suelo, pérdida de control del arma, tropiezos/caídas al suelo, pérdida de sincronización con la música, salir del tatami (área 10x10).\n` +
          `- Menos 0.3 puntos: Uso de joyas o piercings de cualquier tipo.\n` +
          `- Descalificación: Caída del arma por segunda vez, rotura del arma, malas palabras en la música, uso de vendas en los ojos, vestuario teatral o armas no permitidas.\n` +
          `- Puntos por Salidas del Tatami: 1ª, 2ª y 3ª salida = 1 punto menos cada una. 4ª salida = Descalificación verbal.\n` +
          `- Acumulación de Advertencias:\n` +
          `  * Precautoria: No resta puntos (durante el combate).\n` +
          `  * Verbal: Detener combate mas no el tiempo (no resta puntos).\n` +
          `  * 1° Oficial: Detiene combate y tiempo (no resta puntos).\n` +
          `  * 2° Oficial: Detiene combate y tiempo (-1 punto).\n` +
          `  * 3° Oficial: Detiene combate y tiempo (-1 punto).\n` +
          `  * 4° Oficial: Descalificación.\n\n` +
          `TIEMPO MÉDICO Y COMANDOS DEL ÁRBITRO\n` +
          `- Tiempo Médico: Máximo 2 minutos por peleador para todo el combate.\n` +
          `- Comandos Oficiales:\n` +
          `  * SHAKE HANDS (Choquen guantes)\n` +
          `  * FIGHT (Peleen)\n` +
          `  * BREAK (Rompan - paso atrás)\n` +
          `  * STOP (Alto)\n` +
          `  * STOP TIME (Paren el tiempo)\n\n` +
          `ROLES DE JUECES Y COACHES\n` +
          `- Juez / Mesa: Anunciar rounds, registrar amonestaciones, verificar equipamiento.\n` +
          `- Coach: Debe estar presente en la esquina, llevar toalla y botella de agua, y puede pedir "Tiempo" un máximo de 2 veces en todo el combate.`,
        imagenUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        fechaPublicacion: new Date().toISOString().split('T')[0]
      }
    });
    console.log('Added: Reglamento de Competición Oficial WAKO 2026');
  } else {
    console.log('Skipped: WAKO rules already exist');
  }

  console.log('Insertion completed successfully.');
}

main()
  .catch(e => {
    console.error('Error inserting articles:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
