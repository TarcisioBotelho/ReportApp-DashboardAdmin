import React, { useEffect, useState } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig'; // Certifique-se de que o axios está configurado corretamente
import Logout from '../components/Logout';
import { Report, Status } from '../types'; // Importe as interfaces do arquivo de tipos

const Dashboard: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [editingReportId, setEditingReportId] = useState<number | null>(null);
  const [newStatusId, setNewStatusId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/admin/reports', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReports(response.data);
      } catch (error) {
        console.error('Erro ao buscar reportes:', error);
      }
    };

    const fetchStatuses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/admin/statuses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStatuses(response.data);
      } catch (error) {
        console.error('Erro ao buscar status:', error);
      }
    };

    fetchReports();
    fetchStatuses();
  }, []);

  const handleEditClick = (reportId: number) => {
    setEditingReportId(reportId);
    const report = reports.find(r => r.id === reportId);
    setNewStatusId(report?.status?.id || null);
  };

  const handleSaveClick = async (reportId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/admin/update-status', {
        reportId,
        statusId: newStatusId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedReport = response.data;
      setReports(reports.map(report => 
        report.id === reportId ? { ...report, status: updatedReport.status } : report
      ));
      setEditingReportId(null);
      setNewStatusId(null);
    } catch (error) {
      console.error('Erro ao salvar status:', error);
    }
  };

  // Dividir os reportes em duas listas
  const completedReports = reports.filter(report => report.status?.name === 'Concluido');
  const pendingReports = reports.filter(report => report.status?.name !== 'Concluido');

  const handleLogout = () => {
    // Redirecionar para a rota de logout
    navigate('/logout');
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.topBar}>
        <div style={styles.titleContainer}>
          <h2 style={styles.reportAppTitle}>ReportApp</h2>
          <h2 style={styles.panelTitle}>Painel de Controle</h2>
        </div>
        <div style={styles.buttonContainer}>
          <button onClick={handleLogout} style={styles.button}>Sair</button>
        </div>
      </div>
      <div style={styles.innerContainer}>
        <h3 style={styles.sectionTitle}>Todos os Reportes</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Usuário</th>
              <th style={styles.th}>Título</th>
              <th style={styles.th}>Descrição</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pendingReports.map((report) => (
              <tr key={report.id}>
                <td style={styles.td}>{report.user?.name || 'Usuário desconhecido'}</td>
                <td style={styles.td}>{report.title}</td>
                <td style={styles.td}>{report.description}</td>
                <td style={styles.td}>{report.type?.name || 'Tipo desconhecido'}</td>
                <td style={styles.td}>
                  {editingReportId === report.id ? (
                    <select 
                      value={newStatusId ?? undefined} 
                      onChange={(e) => setNewStatusId(Number(e.target.value))}
                    >
                      {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    report.status?.name || 'Status desconhecido'
                  )}
                </td>
                <td style={styles.td}>
                  {editingReportId === report.id ? (
                    <button onClick={() => handleSaveClick(report.id)} style={styles.button}>
                      Salvar
                    </button>
                  ) : (
                    <button onClick={() => handleEditClick(report.id)} style={styles.button}>
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={styles.sectionTitle}>Status Concluidos</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Usuário</th>
              <th style={styles.th}>Título</th>
              <th style={styles.th}>Descrição</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {completedReports.map((report) => (
              <tr key={report.id}>
                <td style={styles.td}>{report.user?.name || 'Usuário desconhecido'}</td>
                <td style={styles.td}>{report.title}</td>
                <td style={styles.td}>{report.description}</td>
                <td style={styles.td}>{report.type?.name || 'Tipo desconhecido'}</td>
                <td style={styles.td}>
                  {editingReportId === report.id ? (
                    <select 
                      value={newStatusId ?? undefined} 
                      onChange={(e) => setNewStatusId(Number(e.target.value))}
                    >
                      {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    report.status?.name || 'Status desconhecido'
                  )}
                </td>
                <td style={styles.td}>
                  {editingReportId === report.id ? (
                    <button onClick={() => handleSaveClick(report.id)} style={styles.button}>
                      Salvar
                    </button>
                  ) : (
                    <button onClick={() => handleEditClick(report.id)} style={styles.button}>
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Routes>
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  // Seu CSS permanece o mesmo
  dashboardContainer: {
    fontFamily: 'Arial, sans-serif',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#007bff',
    padding: '10px',
    textAlign: 'center',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  reportAppTitle: {
    color: '#fff',
    margin: '0',
    fontSize: '24px',
    marginRight: '10px',
  },
  panelTitle: {
    color: '#fff',
    margin: '0',
    fontSize: '14px',
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    textAlign: 'center',
  },
  navLink: {
    textDecoration: 'none',
    marginRight: '10px',
  },
  button: {
    padding: '8px 16px',
    background: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  buttonHover: {
    background: '#218838',
  },
  innerContainer: {
    padding: '20px',
  },
  sectionTitle: {
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f4f4f4',
    color: '#333',
    fontWeight: 'bold',
  },
  td: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#fff',
  },
  tdAlternate: {
    backgroundColor: '#f9f9f9',
  },
};

export default Dashboard;