const DEFAULTS = {
    enabled: true, instagram: true, youtube: true,
    size: 0.35, opacity: 0.6, brightness: 0.5, saturate: 1.3, softness: 3, fps: 12
};
const TOGGLES = ['enabled', 'instagram', 'youtube'];
const SLIDERS = ['size', 'opacity', 'brightness', 'saturate', 'softness', 'fps'];
const $ = id => document.getElementById(id);

function render(s) {
    TOGGLES.forEach(id => { $(id).checked = !!s[id]; });
    SLIDERS.forEach(id => {
        $(id).value = s[id];
        $(id + 'V').textContent = s[id];
    });
}

function save(patch) { chrome.storage.local.set(patch); }

chrome.storage.local.get(DEFAULTS, render);

TOGGLES.forEach(id => $(id).addEventListener('change', () => save({ [id]: $(id).checked })));
SLIDERS.forEach(id => $(id).addEventListener('input', () => {
    const v = parseFloat($(id).value);
    $(id + 'V').textContent = v;
    save({ [id]: v });
}));
$('reset').addEventListener('click', () => chrome.storage.local.set(DEFAULTS, () => render(DEFAULTS)));