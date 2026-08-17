import { faker } from '@faker-js/faker';

import { User } from '../interfaces/user';
import { Lawyer } from '../interfaces/lawyer';
import { Contact } from '../interfaces/contact';
import { Appointment } from '../interfaces/appointment';

export interface SeedData {
  users: User[];
  lawyers: Lawyer[];
  contacts: Contact[];
  appointments: Appointment[];
}

const userNames = [
  'Ana Carolina Oliveira',
  'Bruno Henrique Santos',
  'Camila Fernanda Souza',
  'Daniel Augusto Pereira',
  'Eduarda Martins Costa',
  'Felipe Rodrigues Almeida',
  'Gabriela Cristina Lima',
  'Henrique Gabriel Ferreira',
  'Isabela Vitória Gomes',
  'Lucas Rafael Barbosa',
];

const lawyerNames = ['Lucas Mendes Ribeiro', 'Fernanda Almeida Costa', 'Marcelo Henrique Souza'];

const lawyerSpecialties = [
  ['Direito de Família', 'Direito Civil', 'Direito Trabalhista'],
  ['Direito Empresarial', 'Direito Tributário', 'Direito Civil'],
  ['Direito Criminal', 'Direito Trabalhista', 'Direito Civil'],
];

const lawyerBios = [
  'Atuação dedicada à resolução de questões familiares e civis, com atendimento próximo, estratégico e personalizado para cada cliente.',
  'Experiência na assessoria de empresas e questões tributárias, buscando soluções jurídicas seguras e adequadas a cada situação.',
  'Atuação voltada ao Direito Criminal e Trabalhista, com foco na defesa dos interesses e direitos de seus clientes.',
];

const contactMessages = [
  'Gostaria de obter orientação sobre uma questão familiar e saber quais documentos preciso apresentar para iniciar o atendimento.',
  'Preciso de orientação sobre uma situação trabalhista e gostaria de entender quais são os meus direitos neste caso.',
  'Gostaria de agendar uma consulta para conversar sobre uma questão relacionada ao meu processo.',
  'Tenho algumas dúvidas sobre uma questão empresarial e gostaria de conversar com um advogado especializado.',
  'Preciso de orientação jurídica para resolver uma situação relacionada a um contrato.',
  'Gostaria de saber como funciona o atendimento e quais documentos devo levar para a consulta.',
  'Estou enfrentando uma situação familiar e gostaria de receber orientação sobre os próximos passos.',
  'Tenho dúvidas sobre um processo em andamento e gostaria de conversar com um profissional.',
  'Gostaria de entender melhor quais medidas jurídicas podem ser tomadas no meu caso.',
  'Preciso de uma avaliação do meu caso e gostaria de saber como posso agendar um atendimento.',
];

const appointmentMessages = [
  'Gostaria de conversar sobre a minha situação e receber uma orientação jurídica.',
  'Preciso de ajuda para entender quais medidas podem ser tomadas neste caso.',
  'Gostaria de apresentar meu caso ao advogado e verificar as possibilidades.',
  'Tenho algumas dúvidas sobre o processo e gostaria de esclarecê-las durante a consulta.',
  'Preciso de orientação para saber quais documentos devo reunir.',
  'Gostaria de receber uma análise inicial da minha situação.',
  'Quero conversar com um advogado sobre os próximos passos do meu caso.',
  'Preciso entender melhor os meus direitos antes de tomar uma decisão.',
  'Gostaria de agendar uma consulta para explicar todos os detalhes da situação.',
  'Tenho interesse em receber orientação jurídica especializada para o meu caso.',
];

const contactSubjects = [
  'Dúvida jurídica',
  'Solicitação de orientação',
  'Consulta sobre processo',
  'Questão trabalhista',
  'Questão familiar',
  'Questão empresarial',
];

const appointmentTimes = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export function generateSeedData(): SeedData {
  faker.seed(2026);

  const users: User[] = Array.from({ length: 10 }, (_, index) => ({
    id: 1000 + index,
    name: userNames[index],
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number(),
    password: '123456',
    role: 'user',
  }));

  const lawyers: Lawyer[] = Array.from({ length: 3 }, (_, index) => ({
    id: 2000 + index,
    name: lawyerNames[index],
    role: 'Advogado(a) Associado(a)',
    oab: `${faker.number.int({
      min: 100000,
      max: 999999,
    })}/SP`,
    specialties: lawyerSpecialties[index],
    bio: lawyerBios[index],
    image: '',
  }));

  const contacts: Contact[] = Array.from({ length: 10 }, (_, index) => {
    const user = users[index];

    return {
      id: 3000 + index,
      name: user.name,
      email: user.email,
      phone: user.phone,
      subject: contactSubjects[index % contactSubjects.length],
      message: contactMessages[index],
      createdAt: faker.date
        .recent({
          days: 30,
        })
        .toISOString(),
      status: faker.helpers.arrayElement(['new', 'read', 'answered']),
    };
  });

  const appointments: Appointment[] = Array.from({ length: 10 }, (_, index) => {
    const user = users[index];

    const lawyer = lawyers[index % lawyers.length];

    return {
      id: 4000 + index,

      userId: user.id,

      lawyerId: lawyer.id,

      name: user.name,

      email: user.email,

      phone: user.phone,

      area: faker.helpers.arrayElement(lawyer.specialties),

      date: faker.date
        .future({
          years: 1,
        })
        .toISOString()
        .split('T')[0],

      time: appointmentTimes[index % appointmentTimes.length],

      message: appointmentMessages[index],

      status: faker.helpers.arrayElement(['pending', 'confirmed', 'cancelled']),
    };
  });
  return {
    users,
    lawyers,
    contacts,
    appointments,
  };
}
