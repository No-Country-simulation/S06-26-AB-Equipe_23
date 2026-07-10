import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/axios';
import './Login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  
  // Estados de Controle
  const [isCadastro, setIsCadastro] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para capturar quais campos estão com erro visual (borda vermelha)
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  
  // Estado Único de Formulário (Incluindo os Indicadores Atuais)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nomePessoa: '',
    nomeEmpresa: '',
    telefone: '',
    turnoverAtual: '',
    metaTurnover: '',
    desligamentosAtual: '',
    metaDesligamentos: '',
    participacaoDiversaAtual: '',
    metaParticipacaoDiversa: '',
    metaEsgStatus: 'Atingida'
  });

  // Função para aplicar máscara de telefone (00) 00000-0000
  const formatarTelefone = (value: string) => {
    const apenasNumeros = value.replace(/\D/g, '').slice(0, 11);
    
    if (apenasNumeros.length <= 2) {
      return apenasNumeros.length > 0 ? `(${apenasNumeros}` : '';
    }
    if (apenasNumeros.length <= 7) {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    }
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Limpa o estado de erro assim que o usuário digita novamente no campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }

    if (name === 'telefone') {
      setFormData(prev => ({ ...prev, [name]: formatarTelefone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validarSenhaForte = (senha: string) => {
    // Mínimo 8 caracteres, pelo menos uma maiúscula, uma minúscula e um número
    const regexForca = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regexForca.test(senha);
  };

  // --- LÓGICA DE LOGIN ---
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const novosErros: Record<string, boolean> = {};

    if (!formData.email || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) novosErros.email = true;
    if (!formData.password) novosErros.password = true;

    if (Object.keys(novosErros).length > 0) {
      setErrors(novosErros);
      return;
    }

    setErrors({});
    setAuthMessage('');
    setIsSubmitting(true);
    api.post('/login', { email: formData.email, senha: formData.password })
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        navigate('/', { replace: true });
      })
      .catch((error) => {
        const status = error.response?.status;
        setAuthMessage(status === 401 || status === 403
          ? 'E-mail ou senha inválidos.'
          : error.code === 'ECONNABORTED' || !error.response
            ? 'Serviço temporariamente indisponível. Tente novamente.'
            : 'Não foi possível concluir o login. Tente novamente.');
      })
      .finally(() => setIsSubmitting(false));
  };

  // --- VALIDAÇÕES DO MULTI-STEP DE CADASTRO ---
  const nextStep = () => {
    const novosErros: Record<string, boolean> = {};

    if (step === 1) {
      if (!formData.email || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        novosErros.email = true;
      }
      if (!formData.password || !validarSenhaForte(formData.password)) {
        novosErros.password = true;
      }
      if (!formData.confirmPassword || formData.password !== formData.confirmPassword) {
        novosErros.confirmPassword = true;
      }
    }
    
    if (step === 2) {
      // Verifica se inseriu pelo menos nome e sobrenome
      if (!formData.nomePessoa || formData.nomePessoa.trim().split(' ').length < 2) {
        novosErros.nomePessoa = true;
      }
      if (!formData.nomeEmpresa) {
        novosErros.nomeEmpresa = true;
      }
      
      const numerosTelefone = formData.telefone.replace(/\D/g, '');
      if (numerosTelefone.length !== 11) {
        novosErros.telefone = true;
      }
    }

    if (step === 3) {
      if (!formData.turnoverAtual) novosErros.turnoverAtual = true;
      if (!formData.metaTurnover) novosErros.metaTurnover = true;
      if (!formData.desligamentosAtual) novosErros.desligamentosAtual = true;
      if (!formData.metaDesligamentos) novosErros.metaDesligamentos = true;
      if (!formData.participacaoDiversaAtual) novosErros.participacaoDiversaAtual = true;
      if (!formData.metaParticipacaoDiversa) novosErros.metaParticipacaoDiversa = true;
    }

    if (Object.keys(novosErros).length > 0) {
      setErrors(novosErros);
      return;
    }
    
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setErrors({});
    setStep(prev => prev - 1);
  };

  // --- SUBMISSÃO FINAL E CRIAÇÃO DE CONTA ---
  const handleCadastroSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const dadosParaEnvio = {
      email: formData.email,
      password: formData.password,
      nomePessoa: formData.nomePessoa,
      nomeEmpresa: formData.nomeEmpresa,
      telefone: formData.telefone,
      turnoverAtual: Number(formData.turnoverAtual),
      metaTurnover: Number(formData.metaTurnover),
      desligamentosAtual: Number(formData.desligamentosAtual),
      metaDesligamentos: Number(formData.metaDesligamentos),
      participacaoDiversaAtual: Number(formData.participacaoDiversaAtual),
      metaParticipacaoDiversa: Number(formData.metaParticipacaoDiversa),
      metaEsgStatus: formData.metaEsgStatus
    };
    
    api.post('/cadastro', dadosParaEnvio)
      .then((response) => {
        console.log('Cadastro realizado com sucesso:', response.data);
        localStorage.setItem('token', response.data.token);

        // Limpa os dados do formulário local
        setIsCadastro(false);
        setStep(1);
        setFormData({
          email: '', password: '', confirmPassword: '',
          nomePessoa: '', nomeEmpresa: '', telefone: '',
          turnoverAtual: '', metaTurnover: '',
          desligamentosAtual: '', metaDesligamentos: '',
          participacaoDiversaAtual: '', metaParticipacaoDiversa: '',
          metaEsgStatus: 'Atingida'
        });

        // Executa o redirecionamento imediato para a página interna de vagas
        navigate('/vagas');
      })
      .catch((error) => {
        console.error('Erro ao cadastrar:', error);
      });
  };

  return (
    <div className="pageContainer">
      {/* LADO ESQUERDO: Título fixado e descrição */}
      <div className="bannerSection">
        <div className="bannerContent">
          <h1 className="bannerTitle">Plataforma de Vagas ESG</h1>
          <p className="bannerSubtitle">Conectando talentos a empresas comprometidas com a diversidade, inclusão e metas sustentáveis.</p>
        </div>
      </div>

      {/* LADO DIREITO: Painel de Formulários */}
      <div className="formSection">
        <div className="formWrapper">
          <div className="brandLogo">
            <span>appBiT Jobs</span>
          </div>

          {!isCadastro ? (
            /* ================= LOGIN ================= */
            <div className="loginMode">
              <header className="formHeader">
                <h2>Bem-vindo de volta</h2>
                <p>Insira suas credenciais para acessar a plataforma</p>
              </header>

              <form onSubmit={handleLoginSubmit} className="formElement">
                <div className="inputGroup">
                  <label htmlFor="login-email">E-mail</label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'inputError' : ''}
                    placeholder="seu-email@dominio.com"
                  />
                  {errors.email && <span className="errorHint">E-mail obrigatório ou formato incorreto.</span>}
                </div>

                <div className="inputGroup">
                  <label htmlFor="login-password">Senha</label>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? 'inputError' : ''}
                    placeholder="••••••••"
                  />
                  {errors.password && <span className="errorHint">Insira sua senha de acesso.</span>}
                  <button type="button" className="linkButton" onClick={() => setShowPassword((visible) => !visible)}>
                    {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  </button>
                </div>

                {authMessage && <span className="errorHint">{authMessage}</span>}
                <button type="submit" className="submitButton" disabled={isSubmitting}>
                  {isSubmitting ? 'Entrando...' : 'Entrar na plataforma'}
                </button>
              </form>

              <p className="footerText">
                Ainda não tem uma conta?{' '}
                <button
                  type="button"
                  className="linkButton"
                  onClick={() => {
                    setIsCadastro(true);
                    setErrors({});
                  }}
                >
                  Cadastre-se
                </button>
              </p>
            </div>
          ) : (
            /* ================= CADASTRO MULTI-STEP ================= */
            <div className="cadastroMode">
              <header className="formHeader">
                <h2>Criar Conta</h2>
                <p>Passo {step} de 4</p>
                <div className="progressBar">
                  <div className={`progressFill step-${step}`}></div>
                </div>
              </header>

              <form onSubmit={handleCadastroSubmit} className="formElement">
                
                {/* PASSO 1: Credenciais de segurança */}
                {step === 1 && (
                  <div className="stepContainer">
                    <div className="inputGroup">
                      <label htmlFor="cad-email">E-mail Corporativo *</label>
                      <input
                        id="cad-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'inputError' : ''}
                        placeholder="exemplo@empresa.com"
                      />
                      {errors.email && <span className="errorHint">Formato de e-mail corporativo inválido.</span>}
                    </div>
                    
                    <div className="inputGroup">
                      <label htmlFor="cad-password">Senha *</label>
                      <input
                        id="cad-password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={errors.password ? 'inputError' : ''}
                        placeholder="Mínimo 8 caracteres"
                      />
                      {errors.password ? (
                        <span className="errorHint">Mínimo 8 dígitos, conter maiúscula, minúscula e número.</span>
                      ) : (
                        <span className="inputHint">Deve conter letras maiúsculas, minúsculas e números.</span>
                      )}
                    </div>
                    
                    <div className="inputGroup">
                      <label htmlFor="confirmPassword">Confirme sua Senha *</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={errors.confirmPassword ? 'inputError' : ''}
                        placeholder="Repita a senha idêntica"
                      />
                      {errors.confirmPassword && <span className="errorHint">As senhas informadas não combinam.</span>}
                    </div>
                    <button type="button" className="submitButton" onClick={nextStep}>Continuar</button>
                  </div>
                )}

                {/* PASSO 2: Dados Institucionais */}
                {step === 2 && (
                  <div className="stepContainer">
                    <div className="inputGroup">
                      <label htmlFor="nomePessoa">Seu Nome Completo *</label>
                      <input
                        id="nomePessoa"
                        type="text"
                        name="nomePessoa"
                        value={formData.nomePessoa}
                        onChange={handleInputChange}
                        className={errors.nomePessoa ? 'inputError' : ''}
                        placeholder="Nome e sobrenome"
                      />
                      {errors.nomePessoa && <span className="errorHint">O nome inserido precisa ser completo.</span>}
                    </div>
                    
                    <div className="inputGroup">
                      <label htmlFor="nomeEmpresa">Nome da Empresa *</label>
                      <input
                        id="nomeEmpresa"
                        type="text"
                        name="nomeEmpresa"
                        value={formData.nomeEmpresa}
                        onChange={handleInputChange}
                        className={errors.nomeEmpresa ? 'inputError' : ''}
                        placeholder="Nome da organização"
                      />
                      {errors.nomeEmpresa && <span className="errorHint">O nome da empresa é obrigatório.</span>}
                    </div>
                    
                    <div className="inputGroup">
                      <label htmlFor="telefone">Número de Contato *</label>
                      <input
                        id="telefone"
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        className={errors.telefone ? 'inputError' : ''}
                        placeholder="(00) 00000-0000"
                      />
                      {errors.telefone && <span className="errorHint">O número de telefone deve conter 11 dígitos.</span>}
                    </div>
                    
                    <div className="buttonGroupRow">
                      <button type="button" className="backButton" onClick={prevStep}>Voltar</button>
                      <button type="button" className="submitButton" onClick={nextStep}>Continuar</button>
                    </div>
                  </div>
                )}

                {/* PASSO 3: Indicadores Atuais + Metas */}
                {step === 3 && (
                  <div className="stepContainer">
                    
                    {/* Bloco Turnover */}
                    <div className="indicatorDoubleRow">
                      <div className="inputGroup">
                        <label htmlFor="turnoverAtual">Turnover Atual (%) *</label>
                        <input
                          id="turnoverAtual"
                          type="number"
                          step="0.1"
                          name="turnoverAtual"
                          value={formData.turnoverAtual}
                          onChange={handleInputChange}
                          className={errors.turnoverAtual ? 'inputError' : ''}
                          placeholder="Ex: 6.2"
                        />
                        {errors.turnoverAtual && <span className="errorHint">Obrigatório.</span>}
                      </div>
                      <div className="inputGroup">
                        <label htmlFor="metaTurnover">Meta de Turnover (%) *</label>
                        <input
                          id="metaTurnover"
                          type="number"
                          step="0.1"
                          name="metaTurnover"
                          value={formData.metaTurnover}
                          onChange={handleInputChange}
                          className={errors.metaTurnover ? 'inputError' : ''}
                          placeholder="Ex: 5.8"
                        />
                        {errors.metaTurnover && <span className="errorHint">Obrigatório.</span>}
                      </div>
                    </div>

                    {/* Bloco Desligamentos */}
                    <div className="indicatorDoubleRow">
                      <div className="inputGroup">
                        <label htmlFor="desligamentosAtual">Desligamentos Atuais *</label>
                        <input
                          id="desligamentosAtual"
                          type="number"
                          name="desligamentosAtual"
                          value={formData.desligamentosAtual}
                          onChange={handleInputChange}
                          className={errors.desligamentosAtual ? 'inputError' : ''}
                          placeholder="Ex: 45"
                        />
                        {errors.desligamentosAtual && <span className="errorHint">Obrigatório.</span>}
                      </div>
                      <div className="inputGroup">
                        <label htmlFor="metaDesligamentos">Limite Desligamentos *</label>
                        <input
                          id="metaDesligamentos"
                          type="number"
                          name="metaDesligamentos"
                          value={formData.metaDesligamentos}
                          onChange={handleInputChange}
                          className={errors.metaDesligamentos ? 'inputError' : ''}
                          placeholder="Ex: 70"
                        />
                        {errors.metaDesligamentos && <span className="errorHint">Obrigatório.</span>}
                      </div>
                    </div>

                    {/* Bloco Participação Diversa */}
                    <div className="indicatorDoubleRow">
                      <div className="inputGroup">
                        <label htmlFor="participacaoDiversaAtual">Part. Diversa Atual (%) *</label>
                        <input
                          id="participacaoDiversaAtual"
                          type="number"
                          step="0.1"
                          name="participacaoDiversaAtual"
                          value={formData.participacaoDiversaAtual}
                          onChange={handleInputChange}
                          className={errors.participacaoDiversaAtual ? 'inputError' : ''}
                          placeholder="Ex: 75.0"
                        />
                        {errors.participacaoDiversaAtual && <span className="errorHint">Obrigatório.</span>}
                      </div>
                      <div className="inputGroup">
                        <label htmlFor="metaParticipacaoDiversa">Meta Part. Diversa (%) *</label>
                        <input
                          id="metaParticipacaoDiversa"
                          type="number"
                          step="0.1"
                          name="metaParticipacaoDiversa"
                          value={formData.metaParticipacaoDiversa}
                          onChange={handleInputChange}
                          className={errors.metaParticipacaoDiversa ? 'inputError' : ''}
                          placeholder="Ex: 85.0"
                        />
                        {errors.metaParticipacaoDiversa && <span className="errorHint">Obrigatório.</span>}
                      </div>
                    </div>

                    <div className="inputGroup">
                      <label htmlFor="metaEsgStatus">Status da Meta ESG</label>
                      <select
                        id="metaEsgStatus"
                        name="metaEsgStatus"
                        value={formData.metaEsgStatus}
                        onChange={handleInputChange}
                      >
                        <option value="Atingida">Atingida</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Não Atingida">Não Atingida</option>
                      </select>
                    </div>

                    <div className="buttonGroupRow">
                      <button type="button" className="backButton" onClick={prevStep}>Voltar</button>
                      <button type="button" className="submitButton" onClick={nextStep}>Revisar Dados</button>
                    </div>
                  </div>
                )}

                {/* PASSO 4: Revisão Completa */}
                {step === 4 && (
                  <div className="stepContainer">
                    <p className="stepInstruction">Confirme se todos os parâmetros corporativos estão corretos:</p>
                    
                    <div className="reviewBox">
                      <div className="reviewItem"><strong>E-mail:</strong> {formData.email}</div>
                      <div className="reviewItem"><strong>Responsável:</strong> {formData.nomePessoa}</div>
                      <div className="reviewItem"><strong>Empresa:</strong> {formData.nomeEmpresa}</div>
                      <div className="reviewItem"><strong>Contato:</strong> {formData.telefone}</div>
                      <hr className="reviewDivider" />
                      <div className="reviewItem"><strong>Turnover Atual:</strong> {formData.turnoverAtual}% | <strong>Meta:</strong> {formData.metaTurnover}%</div>
                      <div className="reviewItem"><strong>Desligamentos:</strong> {formData.desligamentosAtual} | <strong>Limite:</strong> {formData.metaDesligamentos}</div>
                      <div className="reviewItem"><strong>Part. Diversa Atual:</strong> {formData.participacaoDiversaAtual}% | <strong>Meta:</strong> {formData.metaParticipacaoDiversa}%</div>
                      <div className="reviewItem"><strong>Status ESG:</strong> {formData.metaEsgStatus}</div>
                    </div>

                    <div className="buttonGroupRow">
                      <button type="button" className="backButton" onClick={prevStep}>Voltar</button>
                      <button type="submit" className="submitButton activeSubmit">Concluir e Criar Conta</button>
                    </div>
                  </div>
                )}
              </form>

              <p className="footerText">
                Já possui uma conta?{' '}
                <button type="button" className="linkButton" onClick={() => { setIsCadastro(false); setStep(1); setErrors({}); }}>
                  Fazer Login
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
