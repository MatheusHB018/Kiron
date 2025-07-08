import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaUserEdit, FaArrowLeft, FaSpinner, FaSave, FaUser, FaEnvelope } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getUsuarioById, updateUsuario } from '../services/api';
import './styles/Page.css';
import './styles/CadastroProfissionalPage.css';

const areObjectsEqual = (objA, objB) => {
  if (!objA || !objB) return objA === objB;
  return JSON.stringify(objA) === JSON.stringify(objB);
};

function EditarUsuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ nome: '', email: '', tipo: 'comum' });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = !areObjectsEqual(formData, originalData);

  useEffect(() => {
    getUsuarioById(id)
      .then(data => {
        const initialData = { nome: data.nome, email: data.email, tipo: data.tipo };
        setFormData(initialData);
        setOriginalData(initialData);
      })
      .catch(() => Swal.fire('Erro!', 'Não foi possível carregar os dados do usuário.', 'error').then(() => navigate('/listar-usuarios')))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleNavigateBack = () => {
    if (!isDirty) {
      navigate('/listar-usuarios');
      return;
    }
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Existem alterações não guardadas. Se sair, irá perdê-las.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, sair sem guardar',
      cancelButtonText: 'Não, ficar na página'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/listar-usuarios');
      }
    });
  };

  // FUNÇÃO 'handleChange' CORRIGIDA
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDirty) return;

    setIsSubmitting(true);
    try {
      await updateUsuario(id, formData);
      setOriginalData(formData);
      Swal.fire({
        title: 'Sucesso!',
        text: 'Usuário atualizado com sucesso.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      }).then(() => navigate('/listar-usuarios'));
    } catch (err) {
      Swal.fire('Erro!', err.message || 'Não foi possível atualizar o usuário.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-container"><h2>A carregar...</h2></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaUserEdit className="icon" />
          <h1>Editar Usuário</h1>
        </div>
      </div>
      <button onClick={handleNavigateBack} className="back-link" style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>
        <FaArrowLeft />
        Voltar para a lista
      </button>
      <div className="form-container">
                <form onSubmit={handleSubmit}>
                    {/* CAMPO DE NOME COM ÍCONE */}
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo</label>
                        <div className="input-with-icon">
                            <FaUser className="input-icon" />
                            <input type="text" id="nome" name="nome" value={formData.nome || ''} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* CAMPO DE EMAIL COM ÍCONE */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <FaEnvelope className="input-icon" />
                            <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} required />
                        </div>
                    </div>
          <div className="form-group">
            <label htmlFor="tipo">Tipo de Usuário</label>
            <select id="tipo" name="tipo" value={formData.tipo || 'comum'} onChange={handleChange}>
              <option value="comum">Profissional Comum</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <p className="form-note">A senha não pode ser alterada nesta tela.</p>
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? (
                <><FaSpinner className="spinner" /> A guardar...</>
              ) : (
                <><FaSave /> Salvar Alterações</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarUsuarioPage;