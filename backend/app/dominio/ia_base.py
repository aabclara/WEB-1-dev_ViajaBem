from abc import ABC, abstractmethod
from typing import Any, Dict

class CaracteristicaIABase(ABC):
    """
    Interface abstrata para representar características e operações de Inteligência Artificial
    integradas ao sistema.
    As implementações concretas devem residir na camada de infraestrutura.
    """
    
    @abstractmethod
    async def analisar_dados(self, contexto: str, dados: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analisa os dados fornecidos com base no contexto.
        """
        pass
    
    @abstractmethod
    async def gerar_recomendacao(self, perfil_usuario: Dict[str, Any]) -> str:
        """
        Gera uma recomendação com base no perfil do usuário.
        """
        pass
