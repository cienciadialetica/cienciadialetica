const tabLinks = [...document.querySelectorAll('[data-tab]')];
const tabPanels = [...document.querySelectorAll('[data-panel]')];

function activateTab(tabName, updateUrl = true) {
    const selectedLink = tabLinks.find((link) => link.dataset.tab === tabName);
    const selectedPanel = tabPanels.find((panel) => panel.dataset.panel === tabName);

    if (!selectedLink || !selectedPanel) return;

    tabLinks.forEach((link) => {
        const isActive = link === selectedLink;
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-selected', String(isActive));
        link.tabIndex = isActive ? 0 : -1;
    });

    tabPanels.forEach((panel) => {
        const isActive = panel === selectedPanel;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
    });

    if (updateUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set('aba', tabName);
        window.history.replaceState({}, '', url);
    }
}

if (tabLinks.length) {
    const requestedTab = new URLSearchParams(window.location.search).get('aba');
    activateTab(requestedTab || 'edicao', false);

    tabLinks.forEach((link, index) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            activateTab(link.dataset.tab);
        });

        link.addEventListener('keydown', (event) => {
            if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
            event.preventDefault();
            const direction = event.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (index + direction + tabLinks.length) % tabLinks.length;
            tabLinks[nextIndex].focus();
            activateTab(tabLinks[nextIndex].dataset.tab);
        });
    });
}

const progressBar = document.querySelector('.reading-progress span');

if (progressBar) {
    const updateReadingProgress = () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    };

    updateReadingProgress();
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
}
