/**
 * Factory Method para criação de objetos do sistema Kiron
 *
 * Este factory centraliza a criação de objetos para as principais entidades
 * do sistema, garantindo consistência de dados e validações básicas.
 *
 * Entidades suportadas:
 * - Paciente
 * - Parceiro
 * - Residuo
 * - EntregaMaterial
 * - AgendaColeta
 * - Usuario
 */

class EntityFactory {
    
    /**
     * Método principal do factory - cria objetos baseado no tipo
     * @param {string} type - Tipo da entidade a ser criada
     * @param {Object} data - Dados para popular o objeto
     * @returns {Object} Objeto da entidade criada
     */
    static create(type, data = {}) {
        switch (type.toLowerCase()) {
            case 'paciente':
                return this.createPaciente(data);
            case 'parceiro':
                return this.createParceiro(data);
            case 'residuo':
                return this.createResiduo(data);
            case 'entrega':
            case 'entregamaterial':
                return this.createEntregaMaterial(data);
            case 'coleta':
            case 'agendacoleta':
                return this.createAgendaColeta(data);
            case 'usuario':
                return this.createUsuario(data);
            default:
                throw new Error(`Tipo de entidade não suportado: ${type}`);
        }
    }

    /**
     * Cria um objeto Paciente com estrutura padronizada
     * @param {Object} data - Dados do paciente
     * @returns {Object} Objeto Paciente
     */
    static createPaciente(data = {}) {
        return {
            id_paciente: data.id_paciente || null,
            nome: data.nome || '',
            cpf: data.cpf || '',
            telefone: data.telefone || '',
            email: data.email || '',
            data_nascimento: data.data_nascimento || null,
            cep: data.cep || '',
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            estado: data.estado || '',
            // Métodos utilitários
            getIdadeAproximada() {
                if (!this.data_nascimento) return null;
                const hoje = new Date();
                const nascimento = new Date(this.data_nascimento);
                return hoje.getFullYear() - nascimento.getFullYear();
            },
            getEnderecoCompleto() {
                const partes = [
                    this.logradouro,
                    this.numero,
                    this.complemento,
                    this.bairro,
                    this.cidade,
                    this.estado
                ].filter(parte => parte && parte.trim() !== '');
                return partes.join(', ');
            },
            getCpfFormatado() {
                if (!this.cpf) return '';
                const numeros = this.cpf.replace(/\D/g, '');
                return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            },
            getTelefoneFormatado() {
                if (!this.telefone) return '';
                const numeros = this.telefone.replace(/\D/g, '');
                if (numeros.length === 11) {
                    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (numeros.length === 10) {
                    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
                return this.telefone;
            }
        };
    }

    /**
     * Cria um objeto Parceiro com estrutura padronizada
     * @param {Object} data - Dados do parceiro
     * @returns {Object} Objeto Parceiro
     */
    static createParceiro(data = {}) {
        return {
            id_parceiro: data.id_parceiro || null,
            nome: data.nome || '',
            cnpj: data.cnpj || '',
            inscricao_estadual: data.inscricao_estadual || '',
            responsavel: data.responsavel || '',
            observacoes: data.observacoes || '',
            tipo: data.tipo || '', // 'farmacia', 'ubs', 'empresa_coleta'
            telefone: data.telefone || '',
            email: data.email || '',
            cep: data.cep || '',
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            estado: data.estado || '',
            // Métodos utilitários
            getTipoFormatado() {
                const tipos = {
                    'farmacia': 'Farmácia',
                    'ubs': 'UBS',
                    'empresa_coleta': 'Empresa de Coleta'
                };
                return tipos[this.tipo] || this.tipo;
            },
            getCnpjFormatado() {
                if (!this.cnpj) return '';
                const numeros = this.cnpj.replace(/\D/g, '');
                return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
            },
            getEnderecoCompleto() {
                const partes = [
                    this.logradouro,
                    this.numero,
                    this.complemento,
                    this.bairro,
                    this.cidade,
                    this.estado
                ].filter(parte => parte && parte.trim() !== '');
                return partes.join(', ');
            },
            isColeta() {
                return this.tipo === 'empresa_coleta';
            },
            isFarmacia() {
                return this.tipo === 'farmacia';
            },
            isUBS() {
                return this.tipo === 'ubs';
            }
        };
    }

    /**
     * Cria um objeto Residuo com estrutura padronizada
     * @param {Object} data - Dados do resíduo
     * @returns {Object} Objeto Residuo
     */
    static createResiduo(data = {}) {
        return {
            id_residuo: data.id_residuo || null,
            nome: data.nome || '',
            descricao: data.descricao || '',
            grupo: data.grupo || '', // 'A - Infectante', 'B - Químico', 'D - Comum', 'E - Perfurocortante'
            risco_especifico: data.risco_especifico || '', // 'Biológico', 'Químico', 'Perfurocortante', 'Nenhum'
            estado_fisico: data.estado_fisico || '', // 'Sólido', 'Líquido', 'Semissólido'
            acondicionamento: data.acondicionamento || '', // Tipo de embalagem
            // Métodos utilitários
            getGrupoSigla() {
                if (!this.grupo) return '';
                return this.grupo.charAt(0); // Retorna 'A', 'B', 'D' ou 'E'
            },
            getCorAcondicionamento() {
                const cores = {
                    'Saco Branco Leitoso': '#FFFFFF',
                    'Saco Vermelho': '#FF0000',
                    'Caixa para Perfurocortante (Descarpack)': '#FFFF00',
                    'Galão Rígido': '#808080',
                    'Saco Preto': '#000000'
                };
                return cores[this.acondicionamento] || '#CCCCCC';
            },
            getNivelRisco() {
                const niveis = {
                    'Nenhum': 1,
                    'Químico': 2,
                    'Biológico': 3,
                    'Perfurocortante': 4
                };
                return niveis[this.risco_especifico] || 0;
            },
            isPerigoso() {
                return this.risco_especifico !== 'Nenhum';
            },
            isPerfurocortante() {
                return this.grupo.includes('E -') || this.risco_especifico === 'Perfurocortante';
            }
        };
    }

    /**
     * Cria um objeto EntregaMaterial com estrutura padronizada
     * @param {Object} data - Dados da entrega
     * @returns {Object} Objeto EntregaMaterial
     */
    static createEntregaMaterial(data = {}) {
        return {
            id_entrega: data.id_entrega || null,
            id_paciente: data.id_paciente || null,
            id_residuo: data.id_residuo || null,
            quantidade: parseInt(data.quantidade) || 1,
            data_entrega: data.data_entrega || new Date().toISOString(),
            observacoes: data.observacoes || '',
            status: data.status || 'Aguardando Devolução', // 'Entregue', 'Aguardando Devolução', 'Devolvido', 'Vencido'
            data_prevista_devolucao: data.data_prevista_devolucao || null,
            // Métodos utilitários
            getStatusColor() {
                const cores = {
                    'Entregue': '#28a745',
                    'Aguardando Devolução': '#ffc107',
                    'Devolvido': '#17a2b8',
                    'Vencido': '#dc3545'
                };
                return cores[this.status] || '#6c757d';
            },
            getDiasParaDevolucao() {
                if (!this.data_prevista_devolucao) return null;
                const hoje = new Date();
                const devolucao = new Date(this.data_prevista_devolucao);
                const diffTime = devolucao - hoje;
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            },
            isVencido() {
                const dias = this.getDiasParaDevolucao();
                return dias !== null && dias < 0;
            },
            isProximoVencimento() {
                const dias = this.getDiasParaDevolucao();
                return dias !== null && dias <= 3 && dias >= 0;
            },
            getDataEntregaFormatada() {
                if (!this.data_entrega) return '';
                return new Date(this.data_entrega).toLocaleDateString('pt-BR');
            },
            getDataDevolucaoFormatada() {
                if (!this.data_prevista_devolucao) return '';
                return new Date(this.data_prevista_devolucao).toLocaleDateString('pt-BR');
            }
        };
    }

    /**
     * Cria um objeto AgendaColeta com estrutura padronizada
     * @param {Object} data - Dados da coleta
     * @returns {Object} Objeto AgendaColeta
     */
    static createAgendaColeta(data = {}) {
        return {
            id_agenda: data.id_agenda || null,
            id_paciente: data.id_paciente || null,
            id_parceiro: data.id_parceiro || null,
            data_agendada: data.data_agendada || null,
            status: data.status || 'agendada', // 'agendada', 'realizada', 'cancelada'
            // Métodos utilitários
            getStatusColor() {
                const cores = {
                    'agendada': '#ffc107',
                    'realizada': '#28a745',
                    'cancelada': '#dc3545'
                };
                return cores[this.status] || '#6c757d';
            },
            getStatusFormatado() {
                const status = {
                    'agendada': 'Agendada',
                    'realizada': 'Realizada',
                    'cancelada': 'Cancelada'
                };
                return status[this.status] || this.status;
            },
            getDataAgendadaFormatada() {
                if (!this.data_agendada) return '';
                return new Date(this.data_agendada).toLocaleString('pt-BR');
            },
            isAgendada() {
                return this.status === 'agendada';
            },
            isRealizada() {
                return this.status === 'realizada';
            },
            isCancelada() {
                return this.status === 'cancelada';
            },
            isHoje() {
                if (!this.data_agendada) return false;
                const hoje = new Date();
                const agendada = new Date(this.data_agendada);
                return hoje.toDateString() === agendada.toDateString();
            },
            isAtrasada() {
                if (!this.data_agendada || this.status !== 'agendada') return false;
                const hoje = new Date();
                const agendada = new Date(this.data_agendada);
                return agendada < hoje;
            }
        };
    }

    /**
     * Cria um objeto Usuario com estrutura padronizada
     * @param {Object} data - Dados do usuário
     * @returns {Object} Objeto Usuario
     */
    static createUsuario(data = {}) {
        return {
            id_usuario: data.id_usuario || null,
            nome: data.nome || '',
            email: data.email || '',
            senha: data.senha || '', // Deve ser hash
            tipo: data.tipo || 'comum', // 'admin', 'comum'
            cep: data.cep || '',
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            uf: data.uf || '',
            // Métodos utilitários
            isAdmin() {
                return this.tipo === 'admin';
            },
            isComum() {
                return this.tipo === 'comum';
            },
            getTipoFormatado() {
                const tipos = {
                    'admin': 'Administrador',
                    'comum': 'Usuário Comum'
                };
                return tipos[this.tipo] || this.tipo;
            },
            getEnderecoCompleto() {
                const partes = [
                    this.logradouro,
                    this.numero,
                    this.complemento,
                    this.bairro,
                    this.cidade,
                    this.uf
                ].filter(parte => parte && parte.trim() !== '');
                return partes.join(', ');
            },
            getPrimeiroNome() {
                return this.nome.split(' ')[0] || '';
            },
            getIniciais() {
                return this.nome
                    .split(' ')
                    .map(nome => nome.charAt(0))
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
            }
        };
    }

    /**
     * Valida se um objeto possui os campos obrigatórios
     * @param {string} type - Tipo da entidade
     * @param {Object} obj - Objeto a ser validado
     * @returns {Object} { isValid: boolean, errors: string[] }
     */
    static validate(type, obj) {
        const errors = [];
        
        switch (type.toLowerCase()) {
            case 'paciente':
                if (!obj.nome) errors.push('Nome é obrigatório');
                if (!obj.cpf) errors.push('CPF é obrigatório');
                break;
                
            case 'parceiro':
                if (!obj.nome) errors.push('Nome é obrigatório');
                if (!obj.cnpj) errors.push('CNPJ é obrigatório');
                if (!obj.tipo) errors.push('Tipo é obrigatório');
                break;
                
            case 'residuo':
                if (!obj.nome) errors.push('Nome é obrigatório');
                if (!obj.grupo) errors.push('Grupo é obrigatório');
                if (!obj.risco_especifico) errors.push('Risco específico é obrigatório');
                if (!obj.estado_fisico) errors.push('Estado físico é obrigatório');
                if (!obj.acondicionamento) errors.push('Acondicionamento é obrigatório');
                break;
                
            case 'entregamaterial':
                if (!obj.id_paciente) errors.push('ID do paciente é obrigatório');
                if (!obj.id_residuo) errors.push('ID do resíduo é obrigatório');
                if (!obj.quantidade || obj.quantidade <= 0) errors.push('Quantidade deve ser maior que zero');
                break;
                
            case 'agendacoleta':
                if (!obj.id_paciente) errors.push('ID do paciente é obrigatório');
                if (!obj.id_parceiro) errors.push('ID do parceiro é obrigatório');
                if (!obj.data_agendada) errors.push('Data agendada é obrigatória');
                break;
                
            case 'usuario':
                if (!obj.nome) errors.push('Nome é obrigatório');
                if (!obj.email) errors.push('Email é obrigatório');
                if (!obj.senha) errors.push('Senha é obrigatória');
                break;
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Cria um array de objetos do mesmo tipo
     * @param {string} type - Tipo da entidade
     * @param {Array} dataArray - Array de dados
     * @returns {Array} Array de objetos criados
     */
    static createMany(type, dataArray = []) {
        return dataArray.map(data => this.create(type, data));
    }

    /**
     * Clona um objeto existente com novos dados
     * @param {Object} originalObj - Objeto original
     * @param {Object} newData - Novos dados para aplicar
     * @returns {Object} Novo objeto clonado e atualizado
     */
    static clone(originalObj, newData = {}) {
        return { ...originalObj, ...newData };
    }
}

export default EntityFactory;
