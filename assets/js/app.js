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

async function gerarPDF() {
    const btn = document.querySelector('.pdf-actions button');
    const originalText = btn.textContent;
    btn.textContent = 'Gerando PDF...';
    btn.disabled = true;
    btn.style.opacity = '0.6';

    try {
        const { jsPDF } = window.jspdf;

        // Ocultar elementos que não devem aparecer no PDF
        const pdfActions = document.querySelector('.pdf-actions');
        if (pdfActions) pdfActions.style.display = 'none';

        // Capturar o conteúdo do dashboard
        const element = document.querySelector('.container-fluid');
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            scrollY: 0,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        });

        // Restaurar botão
        if (pdfActions) pdfActions.style.display = 'block';
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';

        // Criar PDF
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [imgWidth, imgHeight]
        });

        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

        // Nome do arquivo baseado no projeto
        const projectName = 'blow-campo-belo';
        const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        pdf.save(`dashboard-${projectName}-${date}.pdf`);

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar PDF. Tente novamente.');

        // Restaurar botão em caso de erro
        if (pdfActions) pdfActions.style.display = 'block';
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}