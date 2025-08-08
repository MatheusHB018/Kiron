// src/pages/CadastroProfissionalPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSave, FaEye, FaEyeSlash, FaArrowLeft, FaSpinner, FaUser, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { cadastrarUsuario } from '../services/api';
import './styles/Page.css';
import './styles/CadastroProfissionalPage.css';

function CadastroProfissionalPage() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        tipoUsuario: 'comum',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCepBlur = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) {
                Swal.fire('Erro', 'CEP não encontrado.', 'error');
                return;
            }
            setFormData(prevState => ({
                ...prevState,
                logradouro: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                uf: data.uf
            }));
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível buscar o CEP. Verifique sua conexão.', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.senha !== formData.confirmarSenha) {
            Swal.fire('Atenção', 'As senhas não coincidem. Por favor, tente novamente.', 'warning');
            return;
        }
        if (formData.senha.length < 6) {
            Swal.fire('Atenção', 'A senha deve ter no mínimo 6 caracteres.', 'warning');
            return;
        }

        setIsSubmitting(true);
        try {
            await cadastrarUsuario(formData);
            Swal.fire({
                title: 'Sucesso!',
                text: 'Usuário cadastrado com sucesso.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true
            }).then(() => {
                navigate('/listar-usuarios');
            });
        } catch (err) {
            Swal.fire({
                title: 'Erro!',
                text: err.message || 'Ocorreu um erro ao cadastrar o usuário.',
                icon: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-title">
                    <FaUserPlus className="icon" />
                    <h1>Cadastro de Usuários</h1>
                </div>
            </div>
            <Link to="/listar-usuarios" className="back-link">
                <FaArrowLeft /> Voltar para a lista
            </Link>
            <p>Adicione novos profissionais ou administradores ao sistema preenchendo o formulário abaixo.</p>

            <div className="form-container">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="nome">Nome Completo</label>
                            <div className="input-with-icon"><FaUser className="input-icon" /><input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Digite o nome completo" /></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-with-icon"><FaEnvelope className="input-icon" /><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="exemplo@email.com" /></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="senha">Senha (mínimo 6 caracteres)</label>
                            <div className="password-input-wrapper"><input type={showPassword ? 'text' : 'password'} id="senha" name="senha" value={formData.senha} onChange={handleChange} required placeholder="Digite a senha" /><button type="button" className="password-toggle-button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmarSenha">Confirmar Senha</label>
                            <div className="password-input-wrapper"><input type={showPassword ? 'text' : 'password'} id="confirmarSenha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required placeholder="Confirme a senha" /><button type="button" className="password-toggle-button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label htmlFor="tipoUsuario">Tipo de Usuário</label>
                            <select id="tipoUsuario" name="tipoUsuario" value={formData.tipoUsuario} onChange={handleChange}><option value="comum">Profissional Comum</option><option value="admin">Administrador</option></select>
                        </div>
                    </div>
                    
                    <h3 style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1.5rem' }}>Endereço</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="cep">CEP</label>
                            <div className="input-with-icon"><FaMapMarkerAlt className="input-icon" /><input type="text" id="cep" name="cep" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} placeholder="Digite o CEP e aguarde" maxLength="9" /></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="logradouro">Logradouro</label>
                            <input type="text" id="logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} readOnly />
                        </div>
                         <div className="form-group">
                            <label htmlFor="numero">Número</label>
                            <input type="text" id="numero" name="numero" value={formData.numero} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="complemento">Complemento</label>
                            <input type="text" id="complemento" name="complemento" value={formData.complemento} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bairro">Bairro</label>
                            <input type="text" id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cidade">Cidade</label>
                            <input type="text" id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="uf">UF</label>
                            <input type="text" id="uf" name="uf" value={formData.uf} onChange={handleChange} maxLength="2" readOnly />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? <><FaSpinner className="spinner" /> A guardar...</> : <><FaSave /> Cadastrar Usuário</>}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CadastroProfissionalPage;