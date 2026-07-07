document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Gráfico de Execução
    const ctx = document.getElementById('executionChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Concluído', 'Em Andamento', 'Pendente'],
            datasets: [{
                data: [75, 15, 10],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
    const savedTime = localStorage.getItem('mondelez_registro_hora');
    if (savedTime) {
        document.getElementById('horario-salvo').textContent = `Último registro: ${savedTime}`;
    }

    const savedRelato = localStorage.getItem('mondelez_relato');
    if (savedRelato) {
        document.getElementById('relato').value = savedRelato;
    }
    document.getElementById('relato').addEventListener('input', function(e) {
        localStorage.setItem('mondelez_relato', e.target.value);
    });
});
function salvarHorario() {
    const hora = document.getElementById('registro-hora').value;
    if (hora) {
        localStorage.setItem('mondelez_registro_hora', hora);
        document.getElementById('horario-salvo').textContent = `Último registro: ${hora}`;
        alert('Horário salvo com sucesso!');
    } else {
        alert('Por favor, selecione um horário.');
    }
}