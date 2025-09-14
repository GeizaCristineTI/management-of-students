const readline = require('readline');

// Array para armazenar os estudantes:
let estudantes = []; 

// Configuração da interface de leitura do terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout  
});

// Função para validar dados do estudante
function validarEstudante(nome, idade, notas) {
  if (!nome || nome.trim() === '') {
    return 'Nome não pode ser vazio';          
  }
  
  if (isNaN(idade) || idade <= 0) {
    return 'Idade deve ser um número positivo';
  }
  
  for (let nota of notas) {
    if (nota < 0 || nota > 10) {
      return 'Notas devem estar entre 0 e 10';
    }
  }
  
  return null;
}

// Função para cadastrar estudante
function cadastrarEstudante() {
  rl.question('Nome do estudante: ', (nome) => {
    rl.question('Idade: ', (idade) => {
      rl.question('Notas (separadas por vírgula): ', (notasInput) => {
        const notas = notasInput.split(',').map(nota => parseFloat(nota.trim()));
        const idadeNum = parseInt(idade);
        
        const erro = validarEstudante(nome, idadeNum, notas);
        if (erro) {
          console.log(`Erro: ${erro}\n`);
          mostrarMenu();
          return;
        }
        
        estudantes.push({
          nome: nome.trim(),
          idade: idadeNum,
          notas: notas
        });
        
        console.log('Estudante cadastrado com sucesso!\n');
        mostrarMenu();
      });
    });
  });
}

// Função para listar todos os estudantes
function listarEstudantes() {
  if (estudantes.length === 0) {
    console.log('Nenhum estudante cadastrado.\n');
    mostrarMenu();
    return;
  }
  
  console.log('\n=== LISTA DE ESTUDANTES ===');
  estudantes.forEach((estudante, index) => {
    const media = calcularMedia(estudante.notas);
    console.log(`${index + 1}. ${estudante.nome} - ${estudante.idade} anos`);
    console.log(`   Notas: ${estudante.notas.join(', ')}`);
    console.log(`   Média: ${media.toFixed(2)}\n`);
  });
  mostrarMenu();
}

// Função para calcular média
function calcularMedia(notas) {
  const soma = notas.reduce((total, nota) => total + nota, 0);
  return soma / notas.length;
}

// Função para buscar estudante por nome
function buscarEstudante() {
  rl.question('Digite o nome para buscar: ', (termo) => {
    const resultado = estudantes.filter(estudante =>
      estudante.nome.toLowerCase().includes(termo.toLowerCase())
    );
    
    if (resultado.length === 0) {
      console.log('Nenhum estudante encontrado.\n');
    } else {
      console.log('\n=== RESULTADO DA BUSCA ===');
      resultado.forEach(estudante => {
        const media = calcularMedia(estudante.notas);
        console.log(`${estudante.nome} - ${estudante.idade} anos`);
        console.log(`Notas: ${estudante.notas.join(', ')}`);
        console.log(`Média: ${media.toFixed(2)}\n`);
      });
    }
    mostrarMenu();
  });
}

// Função de geração relatórios
function gerarRelatorios() {
  const estudantesComMedia = estudantes.map(estudante => ({
    ...estudante,
    media: calcularMedia(estudante.notas)
  }));
  
  // Calcular média geral
  const mediaGeral = estudantesComMedia.reduce((total, estudante) => 
    total + estudante.media, 0) / estudantes.length || 0;
  
  // Encontrar estudante com maior média.
  const melhorEstudante = estudantesComMedia.reduce((melhor, atual) => 
    atual.media > melhor.media ? atual : melhor, {media: -1});
  
  // Filtrar pela situação do estudante.
  const aprovados = estudantesComMedia.filter(e => e.media >= 7);
  const recuperacao = estudantesComMedia.filter(e => e.media >= 5 && e.media < 7);
  const reprovados = estudantesComMedia.filter(e => e.media < 5);
  
  console.log('\n RELATÓRIOS');
  console.log(`Média geral da turma: ${mediaGeral.toFixed(2)}`);
  console.log(`Melhor estudante: ${melhorEstudante.nome || 'Nenhum'} (${melhorEstudante.media.toFixed(2)})`);
  
  console.log('\n Aprovados (média >= 7)');
  aprovados.forEach(e => console.log(`${e.nome}: ${e.media.toFixed(2)}`));
  
  console.log('\n Recuperação (5.0 - 6.9) ');
  recuperacao.forEach(e => console.log(`${e.nome}: ${e.media.toFixed(2)}`));
  
  console.log('\n Reprovados (média < 5)');
  reprovados.forEach(e => console.log(`${e.nome}: ${e.media.toFixed(2)}`));
  
  console.log('');
  mostrarMenu();
}

// Menu principal do sistema de estudantes:
function mostrarMenu() {
  console.log('SISTEMA DE ESTUDANTES - Escolha uma opção:');
  console.log('1. Cadastrar novo estudante');
  console.log('2. Listar estudantes');
  console.log('3. Buscar estudante');
  console.log('4. Gerar relatórios');
  console.log('5. Sair');
  
  rl.question('Escolha uma opção: ', (opcao) => {
    switch (opcao) {
      case '1':
        cadastrarEstudante();
        break;
      case '2':
        listarEstudantes();
        break;
      case '3':
        buscarEstudante();
        break;
      case '4':
        gerarRelatorios();
        break;
      case '5':   
        console.log('Saindo do sistema...');
        rl.close();
        break;
      default:
        console.log('Opção inválida!\n');
        mostrarMenu();
    }
  });
}

// Mensagem para iniciar o sistema:
console.log('Bem-vindo ao Sistema de Gerenciamento de Estudantes!\n');
mostrarMenu();