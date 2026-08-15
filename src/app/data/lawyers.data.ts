import { Lawyer } from '../interfaces/lawyer';

export const LAWYERS: Lawyer[] = [
  {
    id: 1,
    name: 'Advogado(a) Associado(a) 1',
    role: 'Advogado(a) Associado(a)',
    oab: 'OAB/UF 000000',
    specialties: [
      'Direito de Família',
      'Direito Criminal',
      'Direito do Trabalho',
    ],
    bio: 'Atuação jurídica dedicada à orientação e defesa dos interesses dos clientes, buscando soluções estratégicas e adequadas para cada caso.',
    image: '/images/lawyers/lawyer-1.jpg',
  },
  {
    id: 2,
    name: 'Advogado(a) Associado(a) 2',
    role: 'Advogado(a) Associado(a)',
    oab: 'OAB/UF 000000',
    specialties: [
      'Direito Tributário',
      'Direito Empresarial',
    ],
    bio: 'Atuação jurídica voltada à assessoria e representação de clientes em questões empresariais e tributárias.',
    image: '/images/lawyers/lawyer-2.jpg',
  },
];
