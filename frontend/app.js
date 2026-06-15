const genBtn = document.getElementById('generate');
const statusEl = document.getElementById('status');
const planArea = document.getElementById('planArea');
const reachEl = document.getElementById('reach');
const guidelinesEl = document.getElementById('guidelines');
const pdfBtn = document.getElementById('pdfBtn');
const wordBtn = document.getElementById('wordBtn');
const downloadBtns = document.getElementById('downloadBtns');

let lastPlan = null;

genBtn.addEventListener('click', async () => {
  const niche = document.getElementById('niche').value.trim();
  const platform = document.getElementById('platform').value;
  const idea = document.getElementById('idea').value.trim();
  const channel = document.getElementById('channel').value.trim();
  const subs = Number(document.getElementById('subs').value) || 0;

  if (!niche || !idea) {
    alert('Please enter niche and description.');
    return;
  }

  statusEl.textContent = 'Generating...';
  genBtn.disabled = true;
  try {
    const res = await fetch('http://localhost:5000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ niche, platform, idea, channel, subs })
    });

    const data = await res.json();
    lastPlan = data;

    guidelinesEl.classList.remove('hidden');
    guidelinesEl.innerHTML = `
      <p>This tool will guide you from your current position towards your dream of growing followers.<br/>
      It is completely free and will always remain free.<br/>
      Just enter your niche, platform, focus, channel name, and followers.<br/>
      Our AI model will generate a personalized roadmap including content strategy, titles, tags, hashtags, and even daily actions.</p>
    `;

    renderPlan(data, subs);
    downloadBtns.classList.remove('hidden');
    statusEl.textContent = 'Done';
  } catch (err) {
    console.error(err);
    alert('Failed to generate plan. See console.');
    statusEl.textContent = 'Error';
  } finally {
    genBtn.disabled = false;
  }
});

function renderPlan(data, subs) {
  planArea.innerHTML = '';

  // Overview
  planArea.innerHTML += `<div class="bg-white/5 p-4 rounded-lg"><h3 class="text-white font-semibold">Overview</h3><p class="text-white/80 mt-2">${data.overview || ''}</p></div>`;

  // Guidance
  planArea.innerHTML += `<div class="bg-white/5 p-4 rounded-lg"><h3 class="text-white font-semibold">Guidance</h3><p class="text-white/80 mt-2">${data.guidance || ''}</p></div>`;

  // Daily Plan
  const dailyDiv = document.createElement('div');
  dailyDiv.className = 'bg-white/5 p-4 rounded-lg';
  dailyDiv.innerHTML = `<h3 class="text-white font-semibold">30-Day Roadmap</h3>`;
  if (Array.isArray(data.dailyPlan)) {
    data.dailyPlan.forEach(d => {
      dailyDiv.innerHTML += `<p class="text-white/70 mt-1"><b>Day ${d.day}:</b> ${d.task}</p>`;
    });
  } else {
    dailyDiv.innerHTML += `<p class="text-white/70 mt-1">No daily plan available.</p>`;
  }
  planArea.appendChild(dailyDiv);

  // Milestones (30%, 60%, 100% growth estimates)
  let inc30 = 0, inc60 = 0, inc100 = 0;
  if (Array.isArray(data.milestones) && data.milestones.length >= 3) {
    inc30 = data.milestones[0].followers;
    inc60 = data.milestones[1].followers;
    inc100 = data.milestones[2].followers;
  }
  reachEl.textContent = `${inc100} followers (est.)`;

  // Content Mix
  const contentMix = Array.isArray(data.contentMix) ? data.contentMix : [];

  updateCharts([inc30, inc60, inc100], contentMix);
}

function updateCharts(values, mix) {
  const ctx = document.getElementById('milestoneChart').getContext('2d');
  if (window.milestoneChart && typeof window.milestoneChart.destroy === 'function') {
    window.milestoneChart.destroy();
  }
  window.milestoneChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['30%','60%','100%'],
      datasets: [{ label:'Followers', data: values, backgroundColor:['#f87171','#fb923c','#34d399'] }]
    },
    options: { responsive:true, plugins:{legend:{display:false}} }
  });

  const ctx2 = document.getElementById('typeChart').getContext('2d');
  if (window.typeChart && typeof window.typeChart.destroy === 'function') {
    window.typeChart.destroy();
  }
  window.typeChart = new Chart(ctx2, {
    type: 'pie',
    data: {
      labels: mix.map(m => m.type),
      datasets: [{ data: mix.map(m => m.percent), backgroundColor:['#ef4444','#3b82f6','#facc15','#8b5cf6','#22c55e'] }]
    },
    options: { responsive:true, plugins:{legend:{position:'bottom', labels:{color:'#fff'}}} }
  });
}
