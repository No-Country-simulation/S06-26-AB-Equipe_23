# Score de match - estado da fonte

O arquivo oficial do MVP `mocks/candidatos_teste.json` já contém o campo `score_match` para os oito candidatos.

Não há, nos arquivos Vísent nem no input atual, uma fórmula oficial suficiente para recalcular esse valor. Portanto:

- o backend pode transportar o valor informado no mock;
- o valor não deve ser recalculado por fórmula criada localmente;
- uma implementação real depende de regra aprovada pelo produto, pesos oficiais e dados da vaga;
- diversidade e conectividade não devem ser usadas como eliminação sem regra formal aprovada.
