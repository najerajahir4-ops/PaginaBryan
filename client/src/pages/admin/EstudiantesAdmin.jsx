import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import {
  Users,
  Plus,
  Search,
  Filter,
  CreditCard,
  Edit,
  Trash2,
  Eye,
  History,
  FileSpreadsheet,
  AlertTriangle,
  FileText,
  MoreVertical,
  MessageCircle
} from 'lucide-react';

const TAEKWONDO_BELTS = [
  "Cinturón Blanco",
  "Cinturón Blanco - Amarillo",
  "Cinturón Amarillo",
  "Cinturón Amarillo - Verde",
  "Cinturón Verde",
  "Cinturón Verde - Azul",
  "Cinturón Azul",
  "Cinturón Azul - Rojo",
  "Cinturón Rojo",
  "Cinturón Rojo - Negro",
];

const KICKBOXING_BELTS = [
  "Cinturón Blanco",
  "Cinturón Blanco - Amarillo",
  "Cinturón Amarillo",
  "Cinturón Naranjo",
  "Cinturón Verde",
  "Cinturón Azul",
  "Cinturón Violeta",
  "Cinturón Café o Marrón",
  "Cinturón Negro",
];

const calculateAge = (dobString) => {
  if (!dobString) return '';
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const EstudiantesAdmin = () => {
  const [students, setStudents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedTab, setSelectedTab] = useState('TODOS');

  // Modal States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Selected Student for Edit/Payment/History
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [activeKebabId, setActiveKebabId] = useState(null);

  // Loading States
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Default Ficha de Inscripción Form State
  const defaultFormState = {
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    edad: '',
    cedula: '',
    celular: '',
    direccion: '',
    horarioElegido: '15:00 a 16:00 hrs',
    alergias: '',
    enfermedades: '',
    lesiones: '',
    contactoEmergenciaNombre: '',
    contactoEmergenciaCelular: '',
    nombreRepresentante: '',
    cedulaRepresentante: '',
    celularRepresentante: '',
    comoSeEntero: '',
    autorizaImagen: true,
    diaDeCobro: 1,
    
    // Internal Admin Fields
    clubId: '',
    grado: 'Cinturón Blanco',
    gradoTKD: 'Cinturón Blanco',
    gradoKB: 'Cinturón Blanco',
    modalidad: 'TAEKWONDO',
    fechaIngreso: new Date().toLocaleDateString('sv-SE'),
    fechaUltimoPago: new Date().toLocaleDateString('sv-SE'),
    periodicidadPago: 'MENSUAL',
    foto: '',
  };

  const [studentForm, setStudentForm] = useState(defaultFormState);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    monto: '50.00',
    fechaPago: new Date().toLocaleDateString('sv-SE'),
    metodoPago: 'TRANSFERENCIA',
    periodoCubierto: 'Mensualidad Corriente',
  });

  const filteredStudentsByTab = students.filter(s => {
    if (selectedTab === 'TAEKWONDO') {
      return s.modalidad === 'TAEKWONDO' || s.modalidad === 'AMBAS';
    } else if (selectedTab === 'KICKBOXING') {
      return s.modalidad === 'KICKBOXING' || s.modalidad === 'AMBAS';
    }
    return true;
  });

  useEffect(() => {
    fetchStudents();
    fetchClubs();
  }, [search, selectedClub, selectedEstado]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveKebabId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedClub) params.clubId = selectedClub;
      if (selectedEstado) params.estadoPago = selectedEstado;

      const res = await API.get('/students', { params });
      const studentsWithDynamicAge = res.data.map(student => ({
        ...student,
        edad: calculateAge(student.fechaNacimiento) || student.edad
      }));
      setStudents(studentsWithDynamicAge);
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const res = await API.get('/clubs');
      setClubs(res.data);
    } catch (err) {
      console.error('Error al cargar clubes:', err);
    }
  };

  const sendWhatsAppNotification = (student) => {
    let phone = student.celular.replace(/\s+/g, '');
    if (phone.startsWith('09')) {
      phone = '593' + phone.substring(1);
    }
    
    let message = '';
    if (student.estadoPago === 'AMARILLO') {
      message = `Hola ${student.nombres}, te saludamos de Najera's Team Central. Te recordamos amablemente que tu pago de mensualidad está próximo a vencer el día ${student.fechaProximoPago}. ¡Gracias por ser parte de nuestra familia marcial!`;
    } else if (student.estadoPago === 'ROJO') {
      message = `Hola ${student.nombres}, te saludamos de Najera's Team Central. Te informamos que tu pago de mensualidad se encuentra vencido desde el día ${student.fechaProximoPago}. Por favor, acércate a cancelar lo más pronto posible para continuar con tus entrenamientos. ¡Gracias!`;
    }

    if (message) {
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    }
  };

  // Open Create/Edit Student Modal
  const handleOpenStudentModal = (student = null) => {
    if (student) {
      setSelectedStudent(student);
      const contactParts = (student.contactoEmergencia || '').split(' - ');
      const contactNombre = contactParts[0] || '';
      const contactCelular = contactParts[1] || '';

      setStudentForm({
        nombres: student.nombres || '',
        apellidos: student.apellidos || '',
        fechaNacimiento: student.fechaNacimiento || '',
        edad: student.edad || '',
        cedula: student.cedula || '',
        celular: student.celular || '',
        direccion: student.direccion || '',
        horarioElegido: student.horarioElegido || '15:00 a 16:00 hrs',
        alergias: student.alergias || '',
        enfermedades: student.enfermedades || '',
        lesiones: student.lesiones || '',
        contactoEmergenciaNombre: contactNombre,
        contactoEmergenciaCelular: contactCelular,
        nombreRepresentante: student.nombreRepresentante || '',
        cedulaRepresentante: student.cedulaRepresentante || '',
        celularRepresentante: student.celularRepresentante || '',
        comoSeEntero: student.comoSeEntero || '',
        autorizaImagen: student.autorizaImagen ?? true,
        diaDeCobro: student.diaDeCobro || 1,

        clubId: student.clubId || '',
        grado: student.grado || 'Cinturón Blanco',
        gradoTKD: student.modalidad === 'AMBAS' ? (student.grado || '').split(' / ')[0] || 'Cinturón Blanco' : student.grado || 'Cinturón Blanco',
        gradoKB: student.modalidad === 'AMBAS' ? (student.grado || '').split(' / ')[1] || 'Cinturón Blanco' : 'Cinturón Blanco',
        modalidad: student.modalidad || 'TAEKWONDO',
        fechaIngreso: student.fechaIngreso || new Date().toLocaleDateString('sv-SE'),
        fechaUltimoPago: student.fechaUltimoPago || new Date().toLocaleDateString('sv-SE'),
        periodicidadPago: student.periodicidadPago || 'MENSUAL',
        foto: student.foto || '',
      });
    } else {
      setSelectedStudent(null);
      setStudentForm(defaultFormState);
    }
    setIsStudentModalOpen(true);
  };

  // Submit Save/Update Student
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    setIsSavingStudent(true);
    try {
      let finalGrado = studentForm.grado;
      if (studentForm.modalidad === 'AMBAS') {
        finalGrado = `${studentForm.gradoTKD} / ${studentForm.gradoKB}`;
      }

      const payload = {
        ...studentForm,
        grado: finalGrado,
        contactoEmergencia: `${studentForm.contactoEmergenciaNombre} - ${studentForm.contactoEmergenciaCelular}`.trim()
      };
      delete payload.contactoEmergenciaNombre;
      delete payload.contactoEmergenciaCelular;
      delete payload.gradoTKD;
      delete payload.gradoKB;

      if (selectedStudent) {
        await API.put(`/students/${selectedStudent.id}`, payload);
      } else {
        await API.post('/students', payload);
      }
      setIsStudentModalOpen(false);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar estudiante.');
    } finally {
      setIsSavingStudent(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStudentForm(prev => ({ ...prev, foto: res.data.url }));
      alert('Foto subida exitosamente');
    } catch (err) {
      console.error(err);
      alert('Error al subir la foto');
    } finally {
      setUploadingImage(false);
    }
  };

  // Open Payment Modal
  const handleOpenPaymentModal = (student) => {
    setSelectedStudent(student);
    setPaymentForm({
      monto: '50.00',
      fechaPago: new Date().toLocaleDateString('sv-SE'),
      metodoPago: 'TRANSFERENCIA',
      periodoCubierto: 'Mensualidad Corriente',
    });
    setIsPaymentModalOpen(true);
  };

  // Save New Payment
  const handleSavePayment = async (e) => {
    e.preventDefault();
    setIsSavingPayment(true);
    try {
      await API.post('/payments', {
        studentId: selectedStudent.id,
        ...paymentForm,
      });
      setIsPaymentModalOpen(false);
      fetchStudents();
      alert('Pago registrado y fecha de próximo pago recalculada correctamente.');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al registrar pago.');
    } finally {
      setIsSavingPayment(false);
    }
  };

  // Open History Modal
  const handleOpenHistoryModal = async (student) => {
    setSelectedStudent(student);
    try {
      const res = await API.get(`/payments/student/${student.id}`);
      setPaymentHistory(res.data);
      setIsHistoryModalOpen(true);
    } catch (err) {
      alert('Error al cargar historial de pagos.');
    }
  };

  // Delete Student
  const handleDeleteStudent = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este estudiante? Esta acción borrará todo su historial.')) {
      setIsDeleting(true);
      try {
        await API.delete(`/students/${id}`);
        fetchStudents();
      } catch (err) {
        alert('Error al eliminar estudiante.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Download Student Ficha as PDF
  const handleDownloadPDF = (student) => {
    if (!student) return;

    const clubObj = clubs.find(c => String(c.id) === String(student.clubId));
    const clubName = clubObj ? clubObj.nombre : 'Sede Central';

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permite las ventanas emergentes (popups) para descargar el PDF.');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ficha de Inscripción - ${student.nombres} ${student.apellidos}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Oswald:wght@500;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      color: #111114;
      background: #fff;
      margin: 0;
      padding: 30px;
      font-size: 11px;
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #C9A227;
      padding-bottom: 12px;
      margin-bottom: 15px;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .logo-img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid #C9A227;
      object-fit: contain;
      background-color: #111114;
    }
    .title-group h1 {
      font-family: 'Oswald', sans-serif;
      margin: 0;
      font-size: 18px;
      color: #0B1550;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .title-group p {
      margin: 2px 0 0 0;
      font-size: 8px;
      color: #96771A;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .meta-info {
      text-align: right;
      font-size: 9px;
    }
    .meta-info div {
      margin-bottom: 2px;
    }
    .meta-label {
      font-weight: bold;
      color: #0B1550;
      text-transform: uppercase;
    }
    .section-title {
      font-family: 'Oswald', sans-serif;
      font-size: 10px;
      color: #0B1550;
      background: #F5F2E9;
      border-left: 4px solid #C9A227;
      padding: 4px 8px;
      margin: 12px 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin-bottom: 8px;
    }
    .col-2 {
      grid-column: span 2;
    }
    .col-3 {
      grid-column: span 3;
    }
    .col-4 {
      grid-column: span 4;
    }
    .field {
      border: 1px solid #e2e8f0;
      padding: 5px 8px;
      background: #fafafa;
      border-radius: 2px;
    }
    .field-label {
      font-size: 8px;
      font-weight: bold;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 1px;
    }
    .field-value {
      font-size: 10px;
      color: #0f172a;
      font-weight: 600;
    }
    .alert-field {
      border-color: #fca5a5;
      background: #fef2f2;
    }
    .alert-field .field-label {
      color: #ef4444;
    }
    .alert-field .field-value {
      color: #991b1b;
    }
    .signature-section {
      margin-top: 30px;
      display: flex;
      justify-content: space-around;
      text-align: center;
    }
    .signature-line {
      border-top: 1.5px dashed #0B1550;
      width: 200px;
      margin-top: 40px;
      padding-top: 4px;
      font-size: 9px;
      font-weight: bold;
      color: #334155;
      text-transform: uppercase;
    }
    .footer {
      margin-top: 25px;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      text-align: center;
      font-size: 7.5px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    @media print {
      body {
        padding: 0;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-container">
      <img src="/logo.png" alt="Najera's Team Logo" class="logo-img" onerror="this.src='https://via.placeholder.com/50'"/>
      <div class="title-group">
        <h1>Najera's Team Central</h1>
        <p>Formativo Especializado • Taekwondo & Kickboxing</p>
      </div>
    </div>
    <div class="meta-info">
      <div><span class="meta-label">Fecha Ingreso:</span> ${student.fechaIngreso || 'N/A'}</div>
      <div><span class="meta-label">Cédula Alumno:</span> ${student.cedula || 'N/A'}</div>
    </div>
  </div>

  <div class="section-title">1. Datos Personales del Alumno</div>
  <div class="grid">
    <div class="field col-2">
      <div class="field-label">Nombres</div>
      <div class="field-value">${student.nombres || 'N/A'}</div>
    </div>
    <div class="field col-2">
      <div class="field-label">Apellidos</div>
      <div class="field-value">${student.apellidos || 'N/A'}</div>
    </div>
    <div class="field">
      <div class="field-label">F. de Nacimiento</div>
      <div class="field-value">${student.fechaNacimiento || 'N/A'}</div>
    </div>
    <div class="field">
      <div class="field-label">Edad</div>
      <div class="field-value">${student.edad || 'N/A'} años</div>
    </div>
    <div class="field col-2">
      <div class="field-label">Celular</div>
      <div class="field-value">${student.celular || 'N/A'}</div>
    </div>
    <div class="field col-4">
      <div class="field-label">Dirección Domiciliaria</div>
      <div class="field-value">${student.direccion || 'N/A'}</div>
    </div>
  </div>

  <div class="section-title">2. Detalles Técnicos & Administrativos</div>
  <div class="grid">
    <div class="field col-2">
      <div class="field-label">Club Asignado</div>
      <div class="field-value">${clubName}</div>
    </div>
    <div class="field">
      <div class="field-label">Modalidad</div>
      <div class="field-value">${student.modalidad || 'N/A'}</div>
    </div>
    <div class="field">
      <div class="field-label">Grado / Cinturón</div>
      <div class="field-value">${student.grado || 'N/A'}</div>
    </div>
    <div class="field col-2">
      <div class="field-label">Horario Elegido</div>
      <div class="field-value">${student.horarioElegido || 'N/A'}</div>
    </div>
    <div class="field col-2">
      <div class="field-label">Periodicidad Pago</div>
      <div class="field-value">${student.periodicidadPago || 'MENSUAL'}</div>
    </div>
  </div>

  <div class="section-title">3. Información Médica & Emergencias</div>
  <div class="grid">
    <div class="field col-2 alert-field">
      <div class="field-label">Contacto de Emergencia</div>
      <div class="field-value">${student.contactoEmergencia || 'N/A'}</div>
    </div>
    <div class="field">
      <div class="field-label">Alergias</div>
      <div class="field-value">${student.alergias || 'Ninguna'}</div>
    </div>
    <div class="field">
      <div class="field-label">Enfermedades Crónicas</div>
      <div class="field-value">${student.enfermedades || 'Ninguna'}</div>
    </div>
    <div class="field col-4">
      <div class="field-label">Lesiones Previas</div>
      <div class="field-value">${student.lesiones || 'Ninguna'}</div>
    </div>
  </div>

  <div class="section-title">4. Datos del Representante (Tutor)</div>
  <div class="grid">
    <div class="field col-2">
      <div class="field-label">Nombre del Responsable</div>
      <div class="field-value">${student.nombreRepresentante || 'N/A'}</div>
    </div>
    <div class="field">
      <div class="field-label">Cédula Responsable</div>
      <div class="field-value">${student.cedulaRepresentante || 'N/A'}</div>
    </div>
    <div class="field">
      <div class="field-label">Celular Responsable</div>
      <div class="field-value">${student.celularRepresentante || 'N/A'}</div>
    </div>
    <div class="field col-4">
      <div class="field-label">¿Cómo se enteró de nosotros?</div>
      <div class="field-value">${student.comoSeEntero || 'N/A'}</div>
    </div>
  </div>

  <div class="signature-section">
    <div>
      <div class="signature-line">Firma y Sello del Director Técnico</div>
    </div>
  </div>

  <div class="footer">
    Najera's Team Central • Dojang Oficial • Tel: +52 (55) 1234-5678 • CDMX, México
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
        window.onafterprint = function() {
          window.close();
        };
      }, 500);
    }
  </script>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Export Students List to Styled Excel (XLS)
  const handleExportExcel = () => {
    if (filteredStudentsByTab.length === 0) {
      alert('No hay estudiantes para exportar.');
      return;
    }

    // Headers
    const headers = [
      'Nombres',
      'Apellidos',
      'Cédula',
      'Fecha Nacimiento',
      'Edad',
      'Celular',
      'Dirección',
      'Grado',
      'Modalidad',
      'Periodicidad Pago',
      'Fecha Ingreso',
      'Estado de Pago'
    ];

    // Build rows
    const rowsHtml = filteredStudentsByTab.map(student => {

      let statusClass = 'estado-verde';
      let statusText = 'AL DÍA';
      if (student.estadoPago === 'AMARILLO') {
        statusClass = 'estado-amarillo';
        statusText = 'PRÓXIMO A VENCER';
      } else if (student.estadoPago === 'ROJO') {
        statusClass = 'estado-rojo';
        statusText = 'VENCIDO';
      }

      return `
        <tr>
          <td style="text-align: left; text-transform: uppercase;">${student.nombres || ''}</td>
          <td style="text-align: left; text-transform: uppercase;">${student.apellidos || ''}</td>
          <td style="mso-number-format:'\\@'; text-align: center;">${student.cedula || ''}</td>
          <td style="text-align: center;">${student.fechaNacimiento || ''}</td>
          <td style="text-align: center;">${student.edad || ''}</td>
          <td style="mso-number-format:'\\@'; text-align: center;">${student.celular || ''}</td>
          <td style="text-align: left;">${student.direccion || ''}</td>
          <td style="text-align: left;">${student.grado || ''}</td>
          <td style="text-align: left;">${student.modalidad || ''}</td>
          <td style="text-align: center;">${student.periodicidadPago || 'MENSUAL'}</td>
          <td style="text-align: center;">${student.fechaIngreso || ''}</td>
          <td class="${statusClass}">${statusText}</td>
        </tr>
      `;
    }).join('');

    const headersHtml = headers.map(h => `<th>${h}</th>`).join('');

    // HTML Excel wrapper template with official branding styles
    const excelTemplate = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>Alumnos Najeras Team</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    table {
      border-collapse border-spacing-y-2: collapse;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 11px;
    }
    th {
      background-color: #0B1550;
      color: #F5F2E9;
      font-weight: bold;
      border: 1.5px solid #C9A227;
      padding: 8px 12px;
      text-transform: uppercase;
      text-align: center;
    }
    td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      color: #111114;
    }
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .estado-verde {
      background-color: #d1fae5;
      color: #065f46;
      font-weight: bold;
      text-align: center;
    }
    .estado-amarillo {
      background-color: #fef3c7;
      color: #92400e;
      font-weight: bold;
      text-align: center;
    }
    .estado-rojo {
      background-color: #fee2e2;
      color: #991b1b;
      font-weight: bold;
      text-align: center;
    }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>
        ${headersHtml}
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
</body>
</html>
    `;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Fichas_Alumnos_Najeras_Team_${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Input Change for Form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudentForm(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      if (name === 'fechaNacimiento') {
        const calculatedAge = calculateAge(value);
        if (calculatedAge !== '') {
          updated.edad = calculatedAge;
        }
      }

      // Ajustar automáticamente el cinturón/grado si se cambia la modalidad
      if (name === 'modalidad') {
        if (value === 'TAEKWONDO') {
          updated.grado = updated.gradoTKD || TAEKWONDO_BELTS[0];
        } else if (value === 'KICKBOXING') {
          updated.grado = updated.gradoKB || KICKBOXING_BELTS[0];
        } else if (value === 'AMBAS') {
          updated.grado = `${updated.gradoTKD || TAEKWONDO_BELTS[0]} / ${updated.gradoKB || KICKBOXING_BELTS[0]}`;
        }
      }

      if (name === 'gradoTKD') {
        updated.grado = `${value} / ${prev.gradoKB || KICKBOXING_BELTS[0]}`;
      }
      if (name === 'gradoKB') {
        updated.grado = `${prev.gradoTKD || TAEKWONDO_BELTS[0]} / ${value}`;
      }
      
      return updated;
    });
  };

  const overdueOrDueCount = filteredStudentsByTab.filter((s) => s.estadoPago === 'ROJO' || s.estadoPago === 'AMARILLO').length;

  return (
    <div class="space-y-8">
      
      {/* Tabs / Secciones de Disciplina */}
      <div className="flex border-b border-gray-200 dark:border-white/10 mb-2">
        <button
          onClick={() => setSelectedTab('TODOS')}
          className={`flex-1 py-3 text-xs font-bold tracking-wide transition-colors border-b-2 ${
            selectedTab === 'TODOS'
              ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white bg-gray-100 dark:bg-white/10'
              : 'border-transparent text-gray-500 dark:text-white/50 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          TODOS
        </button>
        <button
          onClick={() => setSelectedTab('TAEKWONDO')}
          className={`flex-1 py-3 text-xs font-bold tracking-wide transition-colors border-b-2 ${
            selectedTab === 'TAEKWONDO'
              ? 'border-dorado-campeon text-red-600 dark:text-dorado-campeon bg-dorado-campeon/5'
              : 'border-transparent text-gray-500 dark:text-gray-900 dark:text-white/50 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          TAEKWONDO
        </button>
        <button
          onClick={() => setSelectedTab('KICKBOXING')}
          className={`flex-1 py-3 text-xs font-bold tracking-wide transition-colors border-b-2 ${
            selectedTab === 'KICKBOXING'
              ? 'border-rojo-impacto text-rojo-impacto bg-rojo-impacto/5'
              : 'border-transparent text-gray-500 dark:text-gray-900 dark:text-white/50 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          KICKBOXING
        </button>
      </div>

      {/* Header & Warning Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-red-600 dark:border-dorado-campeon pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-body tracking-tight">
            Gestión de Estudiantes & Pagos
          </h1>
          <p className="text-sm text-red-600 dark:text-dorado-campeon font-medium tracking-wide uppercase mt-1">
            Administra el padrón de alumnos y registro de fichas
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportExcel}
            className="h-11 px-6 bg-white dark:bg-[#15171C] border border-dorado-campeon text-red-600 dark:text-dorado-campeon text-xs font-bold rounded-none hover:bg-dorado-campeon hover:text-carbon transition-colors inline-flex items-center justify-center gap-2 tracking-wide shadow-[0_0_15px_rgba(227,178,60,0.1)] hover:shadow-[0_0_20px_rgba(227,178,60,0.3)]"
          >
            <FileSpreadsheet size={16} />
            EXCEL
          </button>
          <button
            onClick={() => handleOpenStudentModal()}
            className="h-11 px-6 bg-rojo-impacto hover:bg-white hover:text-rojo-impacto text-gray-900 dark:text-white text-xs font-bold rounded-none transition-colors inline-flex items-center justify-center gap-2 tracking-wide shadow-[0_0_15px_rgba(214,40,57,0.3)] hover:shadow-[0_0_20px_rgba(214,40,57,0.5)]"
          >
            <Plus size={16} />
            NUEVA FICHA
          </button>
        </div>
      </div>

      {/* Warning Badge for Overdue Students */}
      {overdueOrDueCount > 0 && (
        <div className="bg-white dark:bg-[#0A0B0E] border border-dorado-campeon/50 shadow-[0_0_20px_rgba(227,178,60,0.12)] p-4 flex items-center justify-between text-xs text-red-600 dark:text-dorado-campeon relative overflow-hidden">
          <div className="absolute inset-0 bg-dorado-campeon/5 pointer-events-none"></div>
          <div className="flex items-center gap-3 font-bold relative z-10">
            <AlertTriangle size={20} className="text-rojo-impacto" />
            <span className="uppercase tracking-wide">
              Alerta de Cobranza: {overdueOrDueCount} alumnos con pago vencido o próximo a vencer.
            </span>
          </div>
          <button
            onClick={() => setSelectedEstado('ROJO')}
            className="px-4 py-2 bg-rojo-impacto hover:bg-white hover:text-rojo-impacto text-gray-900 dark:text-white font-body font-bold tracking-wide transition-colors relative z-10"
          >
            Ver Vencidos ➔
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white dark:bg-[#0A0B0E] border border-gray-200 dark:border-white/10 shadow-[0_0_15px_rgba(227,178,60,0.08)] p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        <div className="relative">
          <Search className="w-4 h-4 text-red-600 dark:text-dorado-campeon absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 pl-10 pr-4 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon font-body uppercase tracking-wider placeholder-tatami-blanco/30 transition-colors"
          />
        </div>
        <select
          value={selectedEstado}
          onChange={(e) => setSelectedEstado(e.target.value)}
          className="bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon uppercase tracking-wider font-bold transition-colors appearance-none"
        >
          <option value="" className="bg-white dark:bg-[#15171C]">TODOS LOS ESTADOS</option>
          <option value="VERDE" className="bg-white dark:bg-[#15171C]">AL DÍA (VERDE)</option>
          <option value="AMARILLO" className="bg-white dark:bg-[#15171C]">PRÓXIMO A VENCER (AMARILLO)</option>
          <option value="ROJO" className="bg-white dark:bg-[#15171C]">VENCIDO (ROJO)</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0A0B0E] border border-gray-200 dark:border-white/5 shadow-[0_0_8px_rgba(227,178,60,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border-spacing-y-2">
            <thead className="bg-white dark:bg-[#15171C] text-red-600 dark:text-dorado-campeon font-body font-medium text-[13px] tracking-wide font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b-2 border-gray-200 dark:border-dorado-campeon/50">
              <tr>
                <th className="py-4 px-4 border-r border-gray-200 dark:border-white/5">Alumno</th>
                <th className="py-4 px-4 border-r border-gray-200 dark:border-white/5">Cédula</th>
                <th className="py-4 px-4 border-r border-gray-200 dark:border-white/5">Grado</th>
                <th className="py-4 px-4 border-r border-gray-200 dark:border-white/5">Último Pago</th>
                <th className="py-4 px-4 border-r border-gray-200 dark:border-white/5">Próximo Pago</th>
                <th className="py-4 px-4 border-r border-gray-200 dark:border-white/5 text-center">Estado</th>
                <th className="py-4 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-gray-900 dark:text-white/80 font-body">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-red-600 dark:border-dorado-campeon mx-auto"></div>
                  </td>
                </tr>
              ) : filteredStudentsByTab.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-gray-900 dark:text-white/40 font-body font-medium tracking-wide text-sm uppercase">
                    NO HAY FICHAS REGISTRADAS.
                  </td>
                </tr>
              ) : (
                filteredStudentsByTab.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="py-6 px-4 flex items-center gap-4 border-r border-gray-200 dark:border-white/5">
                      <div className="w-10 h-10 bg-white dark:bg-[#15171C] border border-dorado-campeon text-red-600 dark:text-dorado-campeon flex flex-shrink-0 items-center justify-center font-body font-semibold text-sm uppercase shadow-[0_0_10px_rgba(227,178,60,0.2)] group-hover:bg-dorado-campeon group-hover:text-carbon transition-colors">
                        {student.nombres.charAt(0)}{student.apellidos.charAt(0)}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-body font-semibold text-sm text-gray-900 dark:text-white capitalize tracking-wide leading-tight">
                          {student.nombres.toLowerCase()} {student.apellidos.toLowerCase()}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-900 dark:text-white/50">
                            EDAD: {student.edad}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-900 dark:text-white/50">
                            CEL: {student.celular}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4 font-mono text-gray-600 dark:text-gray-900 dark:text-white/70 border-r border-gray-200 dark:border-white/5">{student.cedula}</td>
                    <td className="py-6 px-4 border-r border-gray-200 dark:border-white/5">
                      {student.modalidad === 'AMBAS' ? (
                        <div className="flex flex-col gap-1">
                          <span className="inline-block bg-white dark:bg-[#15171C] border border-gray-200 dark:border-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-900 dark:text-white/70">
                            TKD: <span className="text-red-600 dark:text-dorado-campeon">{student.grado.split(' / ')[0]}</span>
                          </span>
                          <span className="inline-block bg-white dark:bg-[#15171C] border border-gray-200 dark:border-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-900 dark:text-white/70">
                            KB: <span className="text-rojo-impacto">{student.grado.split(' / ')[1]}</span>
                          </span>
                        </div>
                      ) : (
                        <span className="block font-bold text-[10px] uppercase tracking-wide text-gray-900 dark:text-white/90">{student.grado}</span>
                      )}
                    </td>
                    <td className="py-6 px-4 font-mono text-gray-500 dark:text-gray-900 dark:text-white/50 border-r border-gray-200 dark:border-white/5">{student.fechaUltimoPago}</td>
                    <td className="py-6 px-4 font-bold font-mono text-gray-900 dark:text-white border-r border-gray-200 dark:border-white/5">{student.fechaProximoPago}</td>
                    <td className="py-6 px-4 text-center border-r border-gray-200 dark:border-white/5">
                      <StatusBadge status={student.estadoPago} />
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center justify-center gap-2 relative">
                        {/* Always reserve space for 4 buttons (chat, payment, edit, kebab) */}
                        <div className="w-8 h-8">
                          {student.estadoPago !== 'VERDE' && (
                            <button onClick={() => sendWhatsAppNotification(student)} title="Recordatorio de Pago (WhatsApp)" className="w-full h-full flex items-center justify-center bg-white dark:bg-[#15171C] border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-carbon transition-colors shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                              <MessageCircle size={14} />
                            </button>
                          )}
                        </div>
                        <button onClick={() => handleOpenPaymentModal(student)} title="Registrar Pago" className="w-8 h-8 flex items-center justify-center bg-white dark:bg-[#15171C] border border-dorado-campeon/50 text-red-600 dark:text-dorado-campeon hover:bg-dorado-campeon hover:text-carbon transition-colors shadow-[0_0_10px_rgba(227,178,60,0.1)]">
                          <CreditCard size={14} />
                        </button>
                        <button onClick={() => handleOpenStudentModal(student)} title="Ver / Editar Ficha" className="w-8 h-8 flex items-center justify-center bg-white dark:bg-[#15171C] border border-white/20 text-gray-600 dark:text-gray-900 dark:text-white/70 hover:bg-white hover:text-carbon transition-colors shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                          <Edit size={14} />
                        </button>

                        {/* Menú Kebab (Acciones Secundarias) */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveKebabId(activeKebabId === student.id ? null : student.id);
                            }}
                            className={`w-8 h-8 flex items-center justify-center border transition-colors ${activeKebabId === student.id ? 'bg-white text-carbon border-white' : 'bg-white dark:bg-[#15171C] border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-900 dark:text-white/50 hover:border-white/30 hover:text-gray-900 dark:text-white'}`}
                            title="Más acciones"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {activeKebabId === student.id && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#0A0B0E] border border-dorado-campeon/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 py-1 text-left">
                              <button
                                onClick={() => {
                                  handleOpenHistoryModal(student);
                                  setActiveKebabId(null);
                                }}
                                className="w-full px-4 py-2.5 text-xs font-body font-medium tracking-wide text-gray-900 dark:text-white/80 hover:bg-white dark:bg-[#15171C] hover:text-red-600 dark:text-dorado-campeon flex items-center gap-3 transition-colors"
                              >
                                <History size={14} />
                                Historial Pagos
                              </button>
                              <button
                                onClick={() => {
                                  handleDownloadPDF(student);
                                  setActiveKebabId(null);
                                }}
                                className="w-full px-4 py-2.5 text-xs font-body font-medium tracking-wide text-gray-900 dark:text-white/80 hover:bg-white dark:bg-[#15171C] hover:text-red-600 dark:text-dorado-campeon flex items-center gap-3 transition-colors"
                              >
                                <FileText size={14} />
                                Ficha PDF
                              </button>
                              <div className="border-t border-gray-200 dark:border-white/10 my-1"></div>
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                disabled={isDeleting}
                                className="w-full px-4 py-2.5 text-xs font-body font-bold tracking-wide text-rojo-impacto hover:bg-rojo-impacto/10 flex items-center gap-3 disabled:opacity-50 transition-colors"
                              >
                                <Trash2 size={14} />
                                {isDeleting ? 'ELIMINANDO...' : 'ELIMINAR ALUMNO'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: FICHA DE INSCRIPCIÓN OFICIAL */}
      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        title={selectedStudent ? 'FICHA DE INSCRIPCIÓN - EDICIÓN' : "FICHA DE INSCRIPCIÓN - NAJERA'S TEAM CENTRAL"}
      >
        <form onSubmit={handleSaveStudent} class="space-y-8">
          
          {/* SECCIÓN 1: DATOS DEL ALUMNO */}
          <div class="space-y-3">
            <h3 class="text-xs text-red-600 dark:text-dorado-campeon font-body font-semibold tracking-wide border-b border-gray-200 dark:border-white/10 pb-1">
              1. Datos del Alumno
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Nombres</label>
                <input type="text" name="nombres" required value={studentForm.nombres} onChange={handleChange} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Apellidos</label>
                <input type="text" name="apellidos" required value={studentForm.apellidos} onChange={handleChange} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Fecha de Nacimiento</label>
                <input type="date" name="fechaNacimiento" required value={studentForm.fechaNacimiento} onChange={handleChange} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Edad</label>
                <input type="number" name="edad" required readOnly value={studentForm.edad} onChange={handleChange} class="w-full bg-gray-200 dark:bg-[#2A2A30] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none cursor-not-allowed opacity-70" title="Se calcula automáticamente" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Cédula de Identidad</label>
                <input type="text" name="cedula" required value={studentForm.cedula} onChange={handleChange} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Celular</label>
                <input type="text" name="celular" required value={studentForm.celular} onChange={handleChange} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Fecha de Ingreso</label>
                <input type="date" name="fechaIngreso" required value={studentForm.fechaIngreso} onChange={handleChange} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Dirección</label>
                <input type="text" name="direccion" required value={studentForm.direccion} onChange={handleChange} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: HORARIOS DE ENTRENAMIENTO */}
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-red-600 dark:text-dorado-campeon font-body font-bold tracking-normal tracking-wide border-b border-gray-200 dark:border-white/10 pb-1">
              2. Horarios de Entrenamiento
            </h3>
            <div class="bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm p-3">
              <p class="text-[13px] tracking-wide font-semibold text-gray-500 dark:text-gray-400 text-gray-600 dark:text-gray-300 font-bold uppercase mb-2">Días: Lunes, Miércoles y Viernes</p>
              <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Horario Elegido (Marque uno):</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-900 dark:text-white mt-2">
                <label class="flex items-center gap-2 cursor-pointer border border-gray-200 dark:border-white/10 p-2 rounded-sm hover:border-dorado-campeon transition-colors">
                  <input type="radio" name="horarioElegido" value="15:00 a 16:00 hrs" checked={studentForm.horarioElegido === '15:00 a 16:00 hrs'} onChange={handleChange} class="accent-rojo-impacto" />
                  15:00 a 16:00 hrs
                </label>
                <label class="flex items-center gap-2 cursor-pointer border border-gray-200 dark:border-white/10 p-2 rounded-sm hover:border-dorado-campeon transition-colors">
                  <input type="radio" name="horarioElegido" value="16:00 a 17:00 hrs" checked={studentForm.horarioElegido === '16:00 a 17:00 hrs'} onChange={handleChange} class="accent-rojo-impacto" />
                  16:00 a 17:00 hrs
                </label>
                <label class="flex items-center gap-2 cursor-pointer border border-gray-200 dark:border-white/10 p-2 rounded-sm hover:border-dorado-campeon transition-colors">
                  <input type="radio" name="horarioElegido" value="17:00 a 18:00 hrs" checked={studentForm.horarioElegido === '17:00 a 18:00 hrs'} onChange={handleChange} class="accent-rojo-impacto" />
                  17:00 a 18:00 hrs
                </label>
                <label class="flex items-center gap-2 cursor-pointer border border-gray-200 dark:border-white/10 p-2 rounded-sm hover:border-dorado-campeon transition-colors">
                  <input type="radio" name="horarioElegido" value="18:30 a 19:30 hrs" checked={studentForm.horarioElegido === '18:30 a 19:30 hrs'} onChange={handleChange} class="accent-rojo-impacto" />
                  18:30 a 19:30 hrs
                </label>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: INFORMACIÓN DE EMERGENCIA */}
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-red-600 dark:text-dorado-campeon font-body font-bold tracking-normal tracking-wide border-b border-gray-200 dark:border-white/10 pb-1">
              3. Información de Emergencia
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Alergias</label>
                <input type="text" name="alergias" value={studentForm.alergias} onChange={handleChange} placeholder="Ninguna" class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Enfermedades crónicas</label>
                <input type="text" name="enfermedades" value={studentForm.enfermedades} onChange={handleChange} placeholder="Ninguna" class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Lesiones previas</label>
                <input type="text" name="lesiones" value={studentForm.lesiones} onChange={handleChange} placeholder="Ninguna" class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div>
                <label class="block text-[10px] text-red-400 font-bold uppercase mb-1">Nombre Contacto Emergencia *</label>
                <input type="text" name="contactoEmergenciaNombre" required value={studentForm.contactoEmergenciaNombre} onChange={handleChange} placeholder="Ej. Juan Pérez" class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-red-500/50 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div>
                <label class="block text-[10px] text-red-400 font-bold uppercase mb-1">Celular Contacto Emergencia *</label>
                <input type="text" name="contactoEmergenciaCelular" required value={studentForm.contactoEmergenciaCelular} onChange={handleChange} placeholder="Ej. 0988362990" class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-red-500/50 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: DATOS DEL REPRESENTANTE */}
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-red-600 dark:text-dorado-campeon font-body font-bold tracking-normal tracking-wide border-b border-gray-200 dark:border-white/10 pb-1">
              4. Datos del Representante e Información Adicional
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Nombre del Responsable</label>
                <input type="text" name="nombreRepresentante" value={studentForm.nombreRepresentante} onChange={handleChange} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Cédula del Responsable</label>
                <input type="text" name="cedulaRepresentante" value={studentForm.cedulaRepresentante} onChange={handleChange} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Celular del Responsable</label>
                <input type="text" name="celularRepresentante" value={studentForm.celularRepresentante} onChange={handleChange} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">¿Cómo se enteró de nosotros?</label>
                <input type="text" name="comoSeEntero" value={studentForm.comoSeEntero} onChange={handleChange} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
              </div>
            </div>
          </div>



          {/* ADMIN INTERNAL FIELDS (Hidden or minimized) */}
          <div class={`pt-4 border-t border-gray-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 ${studentForm.modalidad === 'AMBAS' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3 bg-[#0B1550]/50 p-3 rounded-sm border border-dorado-campeon/20`}>
            {studentForm.modalidad === 'AMBAS' ? (
              <>
                <div>
                  <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Cinturón Taekwondo</label>
                  <select
                    name="gradoTKD"
                    value={studentForm.gradoTKD}
                    onChange={handleChange}
                    class="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-white/5 rounded-sm px-3 py-1.5 text-[13px] tracking-wide font-semibold text-gray-500 dark:text-gray-400 text-gray-200 focus:outline-none focus:border-dorado-campeon uppercase tracking-wider font-bold"
                  >
                    {TAEKWONDO_BELTS.map((belt) => (
                      <option key={belt} value={belt}>{belt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Cinturón Kickboxing</label>
                  <select
                    name="gradoKB"
                    value={studentForm.gradoKB}
                    onChange={handleChange}
                    class="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-white/5 rounded-sm px-3 py-1.5 text-[13px] tracking-wide font-semibold text-gray-500 dark:text-gray-400 text-gray-200 focus:outline-none focus:border-dorado-campeon uppercase tracking-wider font-bold"
                  >
                    {KICKBOXING_BELTS.map((belt) => (
                      <option key={belt} value={belt}>{belt}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div>
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Grado / Cinturón</label>
                <select
                  name="grado"
                  value={studentForm.grado}
                  onChange={handleChange}
                  class="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-white/5 rounded-sm px-3 py-1.5 text-[13px] tracking-wide font-semibold text-gray-500 dark:text-gray-400 text-gray-200 focus:outline-none focus:border-dorado-campeon uppercase tracking-wider font-bold"
                >
                  {studentForm.modalidad === 'TAEKWONDO'
                    ? TAEKWONDO_BELTS.map((belt) => (
                        <option key={belt} value={belt}>{belt}</option>
                      ))
                    : KICKBOXING_BELTS.map((belt) => (
                        <option key={belt} value={belt}>{belt}</option>
                      ))
                  }
                </select>
              </div>
            )}
            <div>
              <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Modalidad</label>
              <select name="modalidad" value={studentForm.modalidad} onChange={handleChange} class="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-white/5 rounded-sm px-3 py-1.5 text-[13px] tracking-wide font-semibold text-gray-500 dark:text-gray-400 text-gray-200 focus:outline-none focus:border-dorado-campeon">
                <option value="TAEKWONDO">Taekwondo</option>
                <option value="KICKBOXING">Kickboxing</option>
                <option value="AMBAS">Taekwondo y Kickboxing</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Periodicidad Pago</label>
              <select name="periodicidadPago" value={studentForm.periodicidadPago} onChange={handleChange} class="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-white/5 rounded-sm px-3 py-1.5 text-[13px] tracking-wide font-semibold text-gray-500 dark:text-gray-400 text-gray-200 focus:outline-none focus:border-dorado-campeon">
                <option value="MENSUAL">Mensual</option>
                <option value="TRIMESTRAL">Trimestral</option>
                <option value="ANUAL">Anual</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Último Pago</label>
              <input type="date" name="fechaUltimoPago" value={studentForm.fechaUltimoPago} onChange={handleChange} class="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-white/5 rounded-sm px-3 py-1.5 text-[13px] tracking-wide font-semibold text-gray-500 dark:text-gray-400 text-gray-200 focus:outline-none focus:border-dorado-campeon" />
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="text-xs font-bold text-red-600 dark:text-dorado-campeon font-body font-bold tracking-normal tracking-wide border-b border-gray-200 dark:border-white/10 pb-1">
              5. Foto de Perfil (Opcional)
            </h3>
            <div class="flex items-center gap-4 bg-gray-50 dark:bg-[#1C1C21] p-4 rounded-sm border border-gray-200 dark:border-white/10">
              {studentForm.foto ? (
                <img src={studentForm.foto} alt="Perfil" class="w-16 h-16 rounded-full object-cover border border-dorado-campeon" />
              ) : (
                <div class="w-16 h-16 rounded-full bg-white dark:bg-[#15171C] border border-white/20 flex items-center justify-center text-xs text-gray-500 uppercase">Sin Foto</div>
              )}
              <div class="flex-1">
                <label class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-2">Subir nueva foto desde tu equipo:</label>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  class="block w-full text-xs text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-dorado-campeon file:text-carbon hover:file:bg-[#b08d20] transition-all disabled:opacity-50 cursor-pointer"
                />
                {uploadingImage && <p class="text-[10px] text-amber-400 mt-1 animate-pulse">Subiendo imagen a la nube...</p>}
              </div>
            </div>
          </div>



          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedStudent && (
              <button
                type="button"
                onClick={() => handleDownloadPDF(studentForm)}
                class="w-full py-4 bg-white dark:bg-[#15171C] text-red-600 dark:text-dorado-campeon font-bold text-xs uppercase tracking-wide rounded-sm hover:bg-dorado-campeon hover:text-carbon shadow-[0_0_15px_rgba(201,162,39,0.2)] border border-dorado-campeon/50 transition-all flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                Descargar Ficha PDF
              </button>
            )}
            <button
              type="submit"
              disabled={isSavingStudent}
              class={`w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-gray-900 dark:text-white font-medium hover:from-red-500 hover:to-red-400 shadow-md transition-all text-xs uppercase tracking-wide rounded-sm hover:bg-red-700 shadow-[0_0_15px_rgba(140,29,29,0.5)] border border-rojo-impacto transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedStudent ? '' : 'sm:col-span-2'
              }`}
            >
              {isSavingStudent ? 'GUARDANDO...' : 'GUARDAR FICHA OFICIAL'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Registrar Pago */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={`Registrar Pago`}
      >
        <form onSubmit={handleSavePayment} class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Monto ($ USD)</label>
              <input type="number" step="0.01" required value={paymentForm.monto} onChange={(e) => setPaymentForm({ ...paymentForm, monto: e.target.value })} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-4 py-2 text-xs text-gray-900 dark:text-white font-mono focus:outline-none focus:border-dorado-campeon" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Fecha de Pago</label>
              <input type="date" required value={paymentForm.fechaPago} onChange={(e) => setPaymentForm({ ...paymentForm, fechaPago: e.target.value })} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-4 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Método de Pago</label>
              <select value={paymentForm.metodoPago} onChange={(e) => setPaymentForm({ ...paymentForm, metodoPago: e.target.value })} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-4 py-2 text-xs text-gray-900 dark:text-white uppercase font-bold focus:outline-none focus:border-dorado-campeon">
                <option value="TRANSFERENCIA" class="bg-gray-50 dark:bg-[#1C1C21]">Transferencia</option>
                <option value="EFECTIVO" class="bg-gray-50 dark:bg-[#1C1C21]">Efectivo</option>
                <option value="TARJETA" class="bg-gray-50 dark:bg-[#1C1C21]">Tarjeta</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Mes a Cubrir</label>
              <input type="text" required value={paymentForm.periodoCubierto} onChange={(e) => setPaymentForm({ ...paymentForm, periodoCubierto: e.target.value })} class="w-full bg-gray-50 dark:bg-[#1C1C21] border border-gray-200 dark:border-white/10 rounded-sm px-4 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-dorado-campeon" />
            </div>
          </div>

          <p class="text-[10px] text-amber-300 italic bg-amber-500/10 p-3 rounded-sm border border-amber-500/20">
            * Al guardar este pago, la fecha de próximo pago se recalculará al <strong>Día {selectedStudent?.diaDeCobro}</strong> del siguiente periodo.
          </p>

          <button type="submit" disabled={isSavingPayment} class="w-full py-3 bg-dorado-campeon text-carbon font-bold text-xs uppercase tracking-wide rounded-sm hover:bg-[#b08d20] shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
            {isSavingPayment ? 'PROCESANDO...' : 'Confirmar Pago'}
          </button>
        </form>
      </Modal>

      {/* Modal Historial de Pagos */}
      <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title={`Historial de Pagos`}>
        <div class="space-y-4">
          {paymentHistory.length === 0 ? (
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center py-4 font-body font-semibold uppercase">Sin pagos registrados.</p>
          ) : (
            <div class="divide-y divide-gray-200 dark:divide-white/10 text-xs text-gray-200">
              {paymentHistory.map((p) => (
                <div key={p.id} class="py-3 flex justify-between items-center">
                  <div>
                    <span class="font-bold text-emerald-400 text-sm font-mono">${p.monto.toFixed(2)} USD</span>
                    <span class="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mt-1">{p.periodoCubierto} ({p.metodoPago})</span>
                  </div>
                  <span class="text-gray-600 dark:text-gray-300 font-mono text-[13px] tracking-wide font-semibold text-gray-500 dark:text-gray-400">{p.fechaPago}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default EstudiantesAdmin;
