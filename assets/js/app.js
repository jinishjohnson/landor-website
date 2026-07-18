document.addEventListener("DOMContentLoaded", function () {
    // Guard: ensure data and target exist before doing anything
    if (typeof services === "undefined" || !services) {
        console.error("app.js: 'services' is not defined. Make sure data.js is loaded before app.js.");
        return;
    }

    const accordion = document.getElementById("accordionExample");
    if (!accordion) {
        console.error("app.js: #accordionExample container not found in the DOM.");
        return;
    }

    const slug = new URLSearchParams(window.location.search).get("slug");

    const plusIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.00002 14C6.47458 14 6.04883 13.5742 6.04883 13.0488V0.95119C6.04883 0.425753 6.47458 0 7.00002 0C7.52546 0 7.95121 0.425753 7.95121 0.95119V13.0488C7.95121 13.5742 7.52546 14 7.00002 14Z" fill="#000"/>
<path d="M13.0488 7.95121H0.95119C0.425753 7.95121 0 7.52546 0 7.00002C0 6.47458 0.425753 6.04883 0.95119 6.04883H13.0488C13.5742 6.04883 14 6.47458 14 7.00002C14 7.52546 13.5742 7.95121 13.0488 7.95121Z" fill="#000"/>
</svg>`;

    const minusIcon = `<svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.0488 1.90238H0.95119C0.425753 1.90238 0 1.47663 0 0.95119C0 0.425753 0.425753 0 0.95119 0H13.0488C13.5742 0 14 0.425753 14 0.95119C14 1.47663 13.5742 1.90238 13.0488 1.90238Z" fill="black"/>
</svg>`;

    Object.entries(services).forEach(([key, service], index) => {
        const num = String(index + 1).padStart(2, "0");
        const headingId = `heading-${key}`;
        const collapseId = `collapse-${key}`;
        const isActive = slug === key;
        const collapsedClass = isActive ? "" : " collapsed";
        const collapseClass = isActive ? "accordion-collapse collapse show" : "accordion-collapse collapse";
        const expanded = isActive ? "true" : "false";
        const headerIcon = isActive ? minusIcon : plusIcon;

        accordion.insertAdjacentHTML("beforeend", `
            <div class="tp-services-item tp_fade_anim" data-delay=".2" data-duration=".9">
                <div class="tp-services-header" id="${headingId}">
                    <div class="tp-services-button tp-services-button-black${collapsedClass}" role="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${expanded}" aria-controls="${collapseId}">
                        <div class="tp-services-header">
                            <div class="row tp-align-center">
                                <div class="col-lg-6 col-md-3 col-2">
                                    <span class="tp-services-num">${num}</span>
                                </div>
                                <div class="col-lg-6 col-md-9 col-10">
                                    <div class="tp-services-heading-wrap tp-flex-center tp-justify-between">
                                        <h3 class="tp-services-title tp-fs-24">${service.title}</h3>
                                        <span class="tp-services-icon-toggle" data-key="${key}">${headerIcon}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="${collapseId}" class="${collapseClass}" role="region" aria-labelledby="${headingId}" data-bs-parent="#accordionExample">
                    <div class="tp-services-body">
                        <div class="row">
                            <div class="col-xl-2 col-md-1 col-sm-2">
                                <span class="tp-services-num tp-services-num-larg">${num}</span>
                            </div>
                            <div class="col-xl-3 col-md-4 d-none d-md-flex">
                                <div class="tp-services-img br-20">
                                    <img src="${service.image}" alt="${service.title}">
                                </div>
                            </div>
                            <div class="col-xl-7 col-md-7 col-sm-10">
                                <div class="tp-services-content">
                                    <div class="tp-services-title-wrap tp-flex tp-justify-between">
                                        <h3 class="tp-services-title tp-services-title-larg tp-services-header mb-20">
                                            <a href="service.html?slug=${key}">${service.title}</a>
                                        </h3>
                                        <span class="tp-services-icon-static">${minusIcon}</span>
                                    </div>
                                    <p class="tp-text-black">${service.description}</p>
                                </div>
                                <div class="tp-services-meta">
                                    ${service.tags.map(tag => `<span>${tag}</span>`).join("")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });

    // Toggle plus/minus icon on the header when accordion expands/collapses.
    // Use event delegation on the accordion container so dynamically added
    // items are handled automatically.
    accordion.addEventListener("shown.bs.collapse", function (event) {
        const collapseEl = event.target;
        const headingId = collapseEl.getAttribute("aria-labelledby");
        if (!headingId) return;``
        const heading = document.getElementById(headingId);
        if (!heading) return;
        const iconWrap = heading.querySelector(".tp-services-icon-toggle");
        if (iconWrap) {
            iconWrap.innerHTML = minusIcon;
        }
    });

    accordion.addEventListener("hidden.bs.collapse", function (event) {
        const collapseEl = event.target;
        const headingId = collapseEl.getAttribute("aria-labelledby");
        if (!headingId) return;
        const heading = document.getElementById(headingId);
        if (!heading) return;
        const iconWrap = heading.querySelector(".tp-services-icon-toggle");
        if (iconWrap) {
            iconWrap.innerHTML = plusIcon;
        }
    });

    // Update breadcrumb based on the URL slug
    if (slug && services[slug]) {
        const breadcrumb = document.getElementById("serviceBreadcrumb");
        if (breadcrumb) {
            breadcrumb.textContent = services[slug].breadcrumb;
        }
    }

    // ============================================================
    // Services Overview (tpservices2) rendering
    // ============================================================
    if (typeof servicesOverview === "undefined" || !servicesOverview) {
        console.error("app.js: 'servicesOverview' is not defined. Make sure data.js is loaded before app.js.");
        return;
    }

    const overviewContainer = document.getElementById("tpservices2-cards");
    if (!overviewContainer) {
        console.error("app.js: #tpservices2-cards container not found in the DOM.");
        return;
    }

    const arrowIcon = `<svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.000408173 7.39795H16.7596" stroke="currentcolor" stroke-width="1.5" stroke-miterlimit="10"/>
<path d="M10.1596 0C10.1596 4.08932 13.6667 7.39831 18.0008 7.39831" stroke="currentcolor" stroke-width="1.5" stroke-miterlimit="10"/>
<path d="M18.0008 7.39807C13.6667 7.39807 10.1596 10.7071 10.1596 14.7964" stroke="currentcolor" stroke-width="1.5" stroke-miterlimit="10"/>
</svg>`;

    function buildCard(service, delay) {
        return `
            <div class="tp_fade_anim" data-duration=".9" data-delay="${delay}">
                <div class="tpservices2 p-relative mb-30">
                    <div class="tpservices2__thumb br-15 mb-40">
                        <img src="${service.image}" alt="${service.title}">
                    </div>
                    <div class="tpservices2__main">
                        <div class="tpservices2__icon mb-25">
                            ${service.icon}
                        </div>
                        <div class="tpservices2__content">
                            <h3 class="tpservices2__title tp-fs-24 mb-10"><a href="services-details.html">${service.title}</a></h3>
                            <p class="tp-text-black">${service.description}</p>
                        </div>
                    </div>
                    <div class="tpservices2__link">
                        <a href="services-details.html" class="tpservices2__btn">
                            ${arrowIcon}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    const leftCards = servicesOverview.filter(s => s.column === "left");
    const middleCards = servicesOverview.filter(s => s.column === "middle");
    const rightCards = servicesOverview.filter(s => s.column === "right");

    let html = '';

    // Left column
    leftCards.forEach(service => {
        html += `<div class="col-lg-4 col-md-10 col-sm-10">${buildCard(service, service.delay)}</div>`;
    });

    // Middle column
    if (middleCards.length > 0) {
        html += `<div class="col-lg-4 col-md-10 col-sm-10">`;
        middleCards.forEach(service => {
            html += buildCard(service, service.delay);
        });
        html += `</div>`;
    }

    // Right column
    if (rightCards.length > 0) {
        html += `<div class="col-lg-4 col-md-10 col-sm-10">`;
        html += `<div class="tpservices2__right-wrap">`;
        rightCards.forEach(service => {
            html += buildCard(service, service.delay);
        });
        html += `</div>`;
        html += `</div>`;
    }

    overviewContainer.innerHTML = html;
});