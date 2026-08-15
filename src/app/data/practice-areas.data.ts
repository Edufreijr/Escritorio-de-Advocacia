import { PracticeArea } from '../interfaces/practice-area';

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    id: 1,
    name: 'Direito de Família',
    slug: 'direito-de-familia',
    description:
      'Atuação em questões relacionadas à família, incluindo divórcio, guarda, pensão alimentícia e partilha de bens.',
    icon: 'family',
  },
  {
    id: 2,
    name: 'Direito Criminal',
    slug: 'direito-criminal',
    description:
      'Defesa e orientação jurídica em processos criminais, investigações e demais questões relacionadas ao Direito Penal.',
    icon: 'gavel',
  },
  {
    id: 3,
    name: 'Direito do Trabalho',
    slug: 'direito-do-trabalho',
    description:
      'Assessoria em relações trabalhistas, direitos e obrigações de empregados e empregadores.',
    icon: 'work',
  },
  {
    id: 4,
    name: 'Direito Tributário',
    slug: 'direito-tributario',
    description:
      'Orientação e planejamento em questões tributárias, obrigações fiscais e relações entre contribuintes e o poder público.',
    icon: 'account_balance',
  },
  {
    id: 5,
    name: 'Direito Empresarial',
    slug: 'direito-empresarial',
    description:
      'Assessoria jurídica para empresas em contratos, relações societárias, negócios e questões empresariais.',
    icon: 'business',
  },
];
