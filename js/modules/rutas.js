/* 
   ___  _____    ___
  /   ||  _  |  /   | _
 / /| || |/' | / /| |(_)
/ /_| ||  /| |/ /_| |
\_CONEXIÓN INESTABLE| _
    |_/ \___/     |_/(_)

  https://www.GHbuspsv.de/

  Routes Module - Módulo de rutas y mapa interactivo
*/

"use strict";

window.RoutesModule = ((AppUtils) => {
    // ============================================
    // CONSTANTES - Configuración del mapa
    // ============================================
    const LAST_ROUTE_WINDOW_HOURS = 72;
    const MAP_MIN_SCALE = 1;
    const MAP_MAX_SCALE = 4;
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

    // ============================================
    // CONSTANTES - Posiciones Reales (Lat, Lng)
    // ============================================
        const CITY_POSITIONS = {
        // Lima y alrededores
        lima: { lat: -12.0464, lng: -77.0428 },
        la_victoria: { lat: -12.0655, lng: -77.0211 },
        huachipa: { lat: -12.0125, lng: -76.8994 },
        chosica: { lat: -11.9402, lng: -76.7027 },
        corcona: { lat: -11.8986, lng: -76.5416 },
        matucana: { lat: -11.8447, lng: -76.3853 },
        san_mateo: { lat: -11.7583, lng: -76.3000 },
        ticlio: { lat: -11.5975, lng: -76.1914 },
        morococha: { lat: -11.5997, lng: -76.1408 },

        // Carretera Central / Junín / Pasco
        oroya: { lat: -11.5175, lng: -75.8981 },
        tarma: { lat: -11.4189, lng: -75.6883 },
        carpapata: { lat: -11.3556, lng: -75.5269 },
        san_ramon: { lat: -11.1219, lng: -75.3582 },
        la_merced: { lat: -11.0543, lng: -75.3284 },
        pichanaqui: { lat: -10.9264, lng: -74.8697 },
        satipo: { lat: -11.2522, lng: -74.6386 },
        oxapampa: { lat: -10.5775, lng: -75.4017 },
        jauja: { lat: -11.7758, lng: -75.4967 },
        concepcion: { lat: -11.9167, lng: -75.3167 },
        tunan: { lat: -11.9144, lng: -75.3121 },
        huancayo: { lat: -12.0651, lng: -75.2048 },
        junin: { lat: -11.1667, lng: -75.9833 },
        carhuamayo: { lat: -10.9167, lng: -76.0333 },
        huayre: { lat: -10.8667, lng: -76.0667 },
        cerro_de_pasco: { lat: -10.6675, lng: -76.2567 },
        huanuco: { lat: -9.9294, lng: -76.2397 },
        ambo: { lat: -10.1306, lng: -76.2047 },
        tingo_maria: { lat: -9.2953, lng: -75.9986 },
        pucallpa: { lat: -8.3791, lng: -74.5539 },

        // Norte
        huacho: { lat: -11.1067, lng: -77.6050 },
        barranca: { lat: -10.7500, lng: -77.7667 },
        cajacay: { lat: -10.1558, lng: -77.4422 },
        huaraz: { lat: -9.5278, lng: -77.5278 },
        san_luis: { lat: -9.0967, lng: -77.3278 },
        chimbote: { lat: -9.0744, lng: -78.5936 },
        trujillo: { lat: -8.1159, lng: -79.0287 },
        chiclayo: { lat: -6.7714, lng: -79.8409 },
        piura: { lat: -5.1945, lng: -80.6328 },
        sullana: { lat: -4.9039, lng: -80.6853 },
        talara: { lat: -4.5772, lng: -81.2719 },
        tumbes: { lat: -3.5669, lng: -80.4515 },
        cajamarca: { lat: -7.1638, lng: -78.5128 },
        tarapoto: { lat: -6.4856, lng: -76.3686 },
        iquitos: { lat: -3.7491, lng: -73.2538 },

        // Sur
        canete: { lat: -13.0769, lng: -76.3878 },
        chincha: { lat: -13.4178, lng: -76.1328 },
        pisco: { lat: -13.7103, lng: -76.2053 },
        paracas: { lat: -13.8406, lng: -76.2517 },
        ica: { lat: -14.0722, lng: -75.7286 },
        nasca: { lat: -14.8306, lng: -74.9389 },
        ayacucho: { lat: -13.1588, lng: -74.2239 },
        abancay: { lat: -13.6339, lng: -72.8814 },
        andahuaylas: { lat: -13.6556, lng: -73.3872 },
        arequipa: { lat: -16.4090, lng: -71.5375 },
        cusco: { lat: -13.5226, lng: -71.9673 },
        puno: { lat: -15.8402, lng: -70.0219 },
        moquegua: { lat: -17.1983, lng: -70.9356 },
        tacna: { lat: -18.0145, lng: -70.2533 },
        puerto_maldonado: { lat: -12.5933, lng: -69.1891 }
    };

    // ============================================
    // CONSTANTES - Alias de ciudades
    // ============================================
        const CITY_ALIASES = {
        lavictoria: 'la_victoria',
        la_victoria_psv: 'la_victoria',
        lima_psv: 'lima',
        la_oroya: 'oroya',
        la_oroya_psv: 'oroya',
        oroya_psv: 'oroya',
        cerro: 'cerro_de_pasco',
        pasco: 'cerro_de_pasco',
        cerro_de_pasco_psv: 'cerro_de_pasco',
        huanuco_psv: 'huanuco',
        ambo_psv: 'ambo',
        junin_psv: 'junin',
        carhuamayo_psv: 'carhuamayo',
        carpapata_psv: 'carpapata',
        concepcion_psv: 'concepcion',
        huancayo_psv: 'huancayo',
        tarma_psv: 'tarma',
        huayre_psv: 'huayre',
        la_merced_psv: 'la_merced',
        san_ramon_psv: 'san_ramon',
        sanramon: 'san_ramon',
        sanluis: 'san_luis',
        san_luis_psv: 'san_luis',
        huaraz_psv: 'huaraz',
        huacho_psv: 'huacho',
        cajacay_psv: 'cajacay',
        morococha_psv: 'morococha',
        chosica_psv: 'chosica',
        corcona_psv: 'corcona',
        matucana_psv: 'matucana',
        san_mateo_psv: 'san_mateo',
        sanmateo: 'san_mateo',
        sanmateo_psv: 'san_mateo',
        ticlio_psv: 'ticlio',
        huachipa_psv: 'huachipa',
        tunan_psv: 'tunan',
        jauja_psv: 'jauja',
        nasca_psv: 'nasca',
        nazca: 'nasca',
        nazca_psv: 'nasca',
        pisco_psv: 'pisco',
        paracas_psv: 'paracas',
        chincha_psv: 'chincha',
        canete_psv: 'canete',
        barranca_psv: 'barranca',
        chimbote_psv: 'chimbote',
        trujillo_psv: 'trujillo',
        chiclayo_psv: 'chiclayo',
        piura_psv: 'piura',
        cajamarca_psv: 'cajamarca',
        ica_psv: 'ica',
        arequipa_psv: 'arequipa',
        cusco_psv: 'cusco',
        cuzco: 'cusco',
        cuzco_psv: 'cusco',
        puno_psv: 'puno',
        ayacucho_psv: 'ayacucho',
        oxapampa_psv: 'oxapampa',
        satipo_psv: 'satipo',
        pichanaqui_psv: 'pichanaqui',
        tingomaria: 'tingo_maria',
        tingomaria_psv: 'tingo_maria',
        tingo_maria_psv: 'tingo_maria',
        pucallpa_psv: 'pucallpa',
        tarapoto_psv: 'tarapoto'
    };

    // ============================================
    // ESTADO DEL MAPA LEAFLET
    // ============================================
    const mapState = {
        mapInstance: null,
        routeLayerGroup: null,
        markerLayerGroup: null,
        polylines: new Map(), // root route id -> L.polyline
        colorPalette: [
            "#dc2626", // Rojo GH
            "#1d4ed8", // Azul Bus
            "#ef4444", // Rojo claro
            "#2563eb", // Azul cobalto
            "#b91c1c", // Rojo oscuro
            "#3b82f6"  // Azul cielo
        ],
        paletteIndex: 0
    };

    // ============================================
    // FUNCIONES DE RUTAS
    // ============================================

    /**
     * Obtiene la fecha de referencia de un trabajo
     */
    function getRouteReferenceDate(job) {
        return AppUtils.getJobReferenceDate(job);
    }

    /**
     * Verifica si un viaje está en progreso
     */
    function isOpenTrip(job) {
        if (!AppUtils.isInProgress(job.status)) return false;
        return !job.completedAt;
    }

    /**
     * Obtiene las últimas rutas abiertas por conductor
     */
    function getLatestOpenRoutePerDriverInLastHours(jobs, hours = LAST_ROUTE_WINDOW_HOURS) {
        const threshold = Date.now() - hours * 60 * 60 * 1000;

        const recentJobs = jobs
            .filter((job) => {
                if (!isOpenTrip(job)) return false;
                const referenceMs = AppUtils.getDateMs(getRouteReferenceDate(job));
                return referenceMs >= threshold;
            })
            .sort(AppUtils.compareByDateDesc);

        const byDriver = new Map();

        recentJobs.forEach((job) => {
            const driverKey = job.userId || AppUtils.normalizeText(job.driverName);
            if (!driverKey || byDriver.has(driverKey)) return;
            byDriver.set(driverKey, job);
        });

        return [...byDriver.values()];
    }

    /**
     * Construye la lista de viajes de rutas
     */
    function buildRouteTrips(jobs) {
        return [...jobs]
            .map((job) => ({
                id: job.id,
                userId: job.userId,
                origin: job.origin,
                originId: job.originId || null,
                destination: job.destination,
                destinationId: job.destinationId || null,
                driverName: job.driverName || "Sin conductor",
                status: job.status || "in_progress",
                distanceKm: job.plannedKm || job.drivenKm || 0,
                kmDriven: job.drivenKm || job.plannedKm || 0,
                startedAt: job.startedAt || null,
                completedAt: job.completedAt || null,
                updatedAt: job.updatedAt || null,
                publicUrl: job.publicUrl || "#"
            }))
            .sort(AppUtils.compareByDateDesc);
    }

    /**
     * Obtiene la ruta asignada por conductor
     */
    function getAssignedRouteByDriver(jobs, recentDriverRoutes = []) {
        const assigned = new Map();

        const processJobs = (jobList) => {
            jobList
                .sort(AppUtils.compareByDateDesc)
                .forEach((job) => {
                    if (!job.userId || assigned.has(job.userId)) return;
                    assigned.set(job.userId, `${job.origin} - ${job.destination}`);
                });
        };

        processJobs(recentDriverRoutes);
        processJobs(jobs);

        return assigned;
    }

    // ============================================
    // FUNCIONES DEL MAPA
    // ============================================

    /**
     * Normaliza el nombre de una ciudad
     */
    function normalizeCityKey(value) {
        return AppUtils.normalizeText(value)
            .replace(/\bpsv\b/g, "")
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");
    }

    /**
     * Resuelve la clave de ciudad
     */
        function resolveCityKey(cityName, cityId) {
        const candidates = [
            normalizeCityKey(cityId),
            normalizeCityKey(cityName)
        ].filter(Boolean);

        for (const candidate of candidates) {
            if (CITY_POSITIONS[candidate]) return candidate;
            const alias = CITY_ALIASES[candidate];
            if (alias && CITY_POSITIONS[alias]) return alias;

            // Coincidencia parcial inteligente
            for (const key of Object.keys(CITY_POSITIONS)) {
                if (candidate.includes(key) || key.includes(candidate)) {
                    return key;
                }
            }
        }

        return null;
    }

    /**
     * Obtiene las coordenadas lat/lng reales de una ciudad
     */
    function getCityPosition(cityName, cityId) {
        const key = resolveCityKey(cityName, cityId);
        return key ? CITY_POSITIONS[key] : null;
    }

    const OSRM_CACHE_PREFIX = "GHbus_osrm_";

    /**
     * Hace un fetch a OSRM para obtener la polilínea de la ruta
     */
        async function fetchRoutePolyline(originPos, destinationPos) {
        if (!originPos || !destinationPos) return null;

        const routeHash = `${originPos.lat},${originPos.lng}_${destinationPos.lat},${destinationPos.lng}`;
        const cacheKey = OSRM_CACHE_PREFIX + routeHash;

        try {
            if (typeof window !== "undefined" && window.localStorage) {
                const cached = window.localStorage.getItem(cacheKey);
                if (cached) return JSON.parse(cached);
            }
        } catch (e) {
            console.warn("Error leyendo caché OSRM:", e);
        }

        const urls = [
            `${window.AppApi?.OSRM_BASE || '/api/osrm'}/${originPos.lng},${originPos.lat};${destinationPos.lng},${destinationPos.lat}?overview=full&geometries=geojson`,
            `https://router.project-osrm.org/route/v1/driving/${originPos.lng},${originPos.lat};${destinationPos.lng},${destinationPos.lat}?overview=full&geometries=geojson`
        ];

        for (const url of urls) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3500);
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.code === "Ok" && data.routes && data.routes.length > 0) {
                        const geometry = data.routes[0].geometry;
                        try {
                            if (typeof window !== "undefined" && window.localStorage) {
                                window.localStorage.setItem(cacheKey, JSON.stringify(geometry));
                            }
                        } catch (e) {}
                        return geometry;
                    }
                }
            } catch (e) {
                // Siguiente URL
            }
        }

        return null;
    }

    // Límites territoriales estrictos de Perú
    const PERU_BOUNDS = [
        [-18.5, -81.5], // Suroeste (Tacna / Costa marítima)
        [-0.03, -68.65] // Noreste (Loreto / frontera)
    ];

    /**
     * Resetea la vista del mapa a todo el Perú
     */
    function resetMapView() {
        if (!mapState.mapInstance) return;
        mapState.mapInstance.flyToBounds(PERU_BOUNDS, { padding: [15, 15], duration: 1.2 });
    }

    /**
     * Centra el mapa en una ruta específica o sus markers
     */
    function focusMapOnRoute(route) {
        if (!mapState.mapInstance || !route) return;

        const polyline = mapState.polylines.get(String(route.id));
        if (polyline) {
            mapState.mapInstance.flyToBounds(polyline.getBounds(), { padding: [40, 40], duration: 1 });
            return;
        }

        // Si no hay polyline por alguna razón, usamos los puntos de origen/destino
        const originPos = getCityPosition(route.origin, route.originId);
        const destinationPos = getCityPosition(route.destination, route.destinationId);

        if (originPos && destinationPos) {
            const bounds = L.latLngBounds(
                [originPos.lat, originPos.lng],
                [destinationPos.lat, destinationPos.lng]
            );
            mapState.mapInstance.flyToBounds(bounds, { padding: [50, 50], duration: 1 });
        }
    }

    /**
     * Inicializa la vista del mapa con Leaflet
     */
    function ensureMapView() {
        const canvas = document.getElementById("routeMapCanvas");
        if (!canvas) return false;

        if (mapState.mapInstance) {
            return true;
        }

        // Esperar a que Leaflet este cargado
        if (typeof L === 'undefined') {
            console.warn("Leaflet aún no está cargado.");
            return false;
        }

        // Crear mapa limitado y bloqueado estrictamente a Perú
        mapState.mapInstance = L.map('routeMapCanvas', {
            zoomControl: false,
            maxBounds: PERU_BOUNDS,
            maxBoundsViscosity: 1.0, // Impide arrastrar el mapa fuera del territorio peruano
            minZoom: 5,
            maxZoom: 16
        }).setView([-9.5, -75.0], 5.5);

        L.control.zoom({
            position: 'bottomright'
        }).addTo(mapState.mapInstance);

        // Capa Esri World Light Gray (limpia, moderna, elegante y minimalista sin marcas de agua ni API key)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; Esri &mdash; DeLorme, NAVTEQ',
            maxZoom: 16
        }).addTo(mapState.mapInstance);

        // Capa de nombres de ciudades y vías
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
            attribution: '',
            maxZoom: 16
        }).addTo(mapState.mapInstance);

        mapState.routeLayerGroup = L.layerGroup().addTo(mapState.mapInstance);
        mapState.markerLayerGroup = L.layerGroup().addTo(mapState.mapInstance);

        return true;
    }

    // ============================================
    // MODALES
    // ============================================

    /**
     * Cierra el modal de ruta
     */
    function closeRouteModal() {
        const modal = document.getElementById("routeModal");
        if (!modal) return;
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    /**
     * Abre el modal de ruta
     */
    function openRouteModal(route) {
        const modal = document.getElementById("routeModal");
        const body = document.getElementById("routeModalBody");
        if (!modal || !body || !route) return;

        const referenceDate = getRouteReferenceDate(route);
        const dateLabel = AppUtils.formatDate(referenceDate);
        const statusLabel = route.status === "completed" ? "Completado" : "En progreso";
        const publicUrl = route.publicUrl && route.publicUrl !== "#" ? route.publicUrl : null;

        body.innerHTML = `
            <div class="modal-head route-modal-head">
                <div>
                    <h3>${route.origin} → ${route.destination}</h3>
                    <p>Conductor: ${route.driverName}</p>
                </div>
            </div>
            <div class="modal-grid">
                <article class="modal-metric">
                    <p>Distancia estimada</p>
                    <strong>${AppUtils.formatNumber(route.distanceKm)} km</strong>
                </article>
                <article class="modal-metric">
                    <p>KM recorridos</p>
                    <strong>${AppUtils.formatNumber(route.kmDriven)} km</strong>
                </article>
                <article class="modal-metric">
                    <p>Estado</p>
                    <strong>${statusLabel}</strong>
                </article>
                <article class="modal-metric">
                    <p>Fecha referencia</p>
                    <strong>${dateLabel}</strong>
                </article>
                <article class="modal-metric">
                    <p>Origen</p>
                    <strong>${route.origin}</strong>
                </article>
                <article class="modal-metric">
                    <p>Destino</p>
                    <strong>${route.destination}</strong>
                </article>
                <article class="modal-metric">
                    <p>Daño (Camión / Carga)</p>
                    <strong style="${route.vehicleDamage > 0 || route.trailersDamage > 0 ? 'color: #dc2626;' : 'color: #16a34a;'}">
                        ${route.vehicleDamage}% / ${route.trailersDamage}%
                    </strong>
                </article>
            </div>
            ${publicUrl ? `<p class="modal-route-link"><a href="${publicUrl}" target="_blank" rel="noopener noreferrer">Ver viaje en Trucky</a></p>` : ""}
        `;

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    }

    // ============================================
    // RENDERIZADO
    // ============================================

    /**
     * Establece el botón de ruta activo
     */
    function setActiveRouteButton(element) {
        document.querySelectorAll(".route-item.active").forEach((item) => {
            item.classList.remove("active");
        });
        if (element) element.classList.add("active");
    }

    /**
     * Establece los elementos del mapa activos (Leaflet)
     */
    function setActiveRouteMapElements(routeId) {
        if (!mapState.mapInstance) return;
        const key = String(routeId || "");

        // Reset all styles
        mapState.polylines.forEach((layer) => {
            layer.setStyle({ weight: 4, opacity: 0.5 });
        });

        // Highlight selected
        const selectedLayer = mapState.polylines.get(key);
        if (selectedLayer) {
            selectedLayer.setStyle({ weight: 7, opacity: 1 });
            selectedLayer.bringToFront();
        }
    }

    /**
     * Crea un marcador de ruta
     */
    function createMarker(route, position, label, markerType, onClick) {
        const marker = document.createElement("button");
        marker.type = "button";
        marker.className = `route-marker ${markerType}`;
        marker.title = label;
        marker.setAttribute("aria-label", label);
        marker.dataset.routeId = String(route.id || "");
        marker.style.left = `${position.x}%`;
        marker.style.top = `${position.y}%`;
        marker.addEventListener("click", (event) => {
            event.stopPropagation();
            onClick();
        });
        return marker;
    }

    /**
     * Renderiza las rutas en el mapa de Leaflet
     */
    async function renderRoutes(routes, source) {
        const routeList = document.getElementById("routeList");
        const routeIndicator = document.getElementById("routeIndicator");

        if (!routeList || !routeIndicator) return;
        if (!ensureMapView()) {
            // Reintentar si Leaflet no cargó aún
            setTimeout(() => renderRoutes(routes, source), 500);
            return;
        }
        mapState.mapInstance.invalidateSize();

        routeList.innerHTML = "";

        mapState.routeLayerGroup.clearLayers();
        mapState.markerLayerGroup.clearLayers();
        mapState.polylines.clear();
        mapState.paletteIndex = 0;

        // Filtrar estrictamente solo rutas dentro del territorio peruano
        const rawRoutes = Array.isArray(routes) ? routes : [];
        const peruRoutes = rawRoutes.filter(route => {
            const originPos = getCityPosition(route.origin, route.originId);
            const destinationPos = getCityPosition(route.destination, route.destinationId);
            return Boolean(originPos && destinationPos);
        });

        // Si hay viajes en Perú se usan exclusivamente esos
        const activeRoutes = peruRoutes.length > 0 ? peruRoutes : rawRoutes;

        const activeCount = activeRoutes.length;
        const todayLabel = AppUtils.getTodayLabelInLima();

        routeIndicator.textContent = activeCount > 0
            ? `${activeCount} conductores con su última ruta en curso (72h) al ${todayLabel}`
            : `Sin rutas en curso por conductor en las últimas 72h (${todayLabel})`;

        if (source === "fallback") {
            routeIndicator.textContent += " (modo demostración)";
        }

        if (activeRoutes.length === 0) {
            routeList.innerHTML = '<p class="hint">No hay viajes recientes en Perú para mostrar.</p>';
            resetMapView();
            return;
        }

        // Crear una lista de promesas para OSRM fetching usando solo rutas de Perú
        const routeRenderPromises = activeRoutes.map(async (route) => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "route-item route-trip-btn";
            item.innerHTML = `
                <span class="route-trip-main">
                    <h4 class="route-trip-cities">
                        <span class="city-name">${route.origin}</span>
                        <span class="city-arrow">→</span>
                        <span class="city-name">${route.destination}</span>
                    </h4>
                    <p class="route-trip-meta">${AppUtils.formatNumber(route.distanceKm)} km · Conductor: ${route.driverName}</p>
                </span>
                <span class="route-trip-km">${AppUtils.formatNumber(route.kmDriven)} km</span>
            `;

            const handleSelect = () => {
                setActiveRouteButton(item);
                setActiveRouteMapElements(route.id);
                focusMapOnRoute(route);
                openRouteModal(route);
            };

            item.addEventListener("click", handleSelect);
            routeList.appendChild(item);

            const originPos = getCityPosition(route.origin, route.originId);
            const destinationPos = getCityPosition(route.destination, route.destinationId);

            if (originPos && destinationPos) {
                // Obtener geometria real
                const geojsonFeature = await fetchRoutePolyline(originPos, destinationPos);

                const routeColor = mapState.colorPalette[mapState.paletteIndex % mapState.colorPalette.length];
                mapState.paletteIndex++;

                let routeLayer;

                if (geojsonFeature) {
                    // Trazar línea de OSRM
                    routeLayer = L.geoJSON(geojsonFeature, {
                        style: {
                            color: routeColor,
                            weight: 4,
                            opacity: 0.7,
                            lineCap: 'round',
                            lineJoin: 'round'
                        }
                    }).addTo(mapState.routeLayerGroup);
                } else {
                    // Fallback a línea recta si falla OSRM
                    routeLayer = L.polyline([
                        [originPos.lat, originPos.lng],
                        [destinationPos.lat, destinationPos.lng]
                    ], {
                        color: routeColor,
                        weight: 4,
                        opacity: 0.7,
                        dashArray: '10, 10'
                    }).addTo(mapState.routeLayerGroup);
                }

                // Guardar referencia para eventos
                mapState.polylines.set(String(route.id), routeLayer);

                // Crear círculos en origen y destino
                const originMarker = L.circleMarker([originPos.lat, originPos.lng], {
                    radius: 5,
                    fillColor: "#fff",
                    color: routeColor,
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 1
                });

                const busSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="12" rx="2" fill="${routeColor}" />
                    <rect x="5" y="6" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.7)" />
                    <rect x="10.5" y="6" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.7)" />
                    <rect x="16" y="6" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.7)" />
                    <circle cx="7" cy="18" r="2.5" fill="#0f172a" />
                    <circle cx="17" cy="18" r="2.5" fill="#0f172a" />
                </svg>`;

                const destMarker = L.marker([destinationPos.lat, destinationPos.lng], {
                    icon: L.divIcon({
                        html: `<div class="bus-marker-wrapper" style="display: flex; align-items: center; justify-content: center; transform: scale(1.3); transition: all 0.3s ease; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${busSvg}</div>`,
                        className: '',
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                    })
                });

                originMarker.bindTooltip(`Origen: ${route.origin}`).addTo(mapState.markerLayerGroup);
                destMarker.bindTooltip(`Destino: ${route.destination} (${route.driverName})`).addTo(mapState.markerLayerGroup);

                // Eventos Leaflet
                routeLayer.on('click', handleSelect);
                destMarker.on('click', handleSelect);
                originMarker.on('click', handleSelect);
            }
        });

        // Esperar a que todss se rendericen para hacer el fitBounds general
        Promise.allSettled(routeRenderPromises).then(() => {
            const allPolylines = Array.from(mapState.polylines.values());
            if (allPolylines.length > 0) {
                const group = new L.featureGroup(allPolylines);
                mapState.mapInstance.fitBounds(group.getBounds(), { padding: [30, 30] });
            } else {
                resetMapView();
            }
        });
    }

    // ============================================
    // EVENTOS
    // ============================================

    /**
     * Configura los eventos del modal
     */
    function setupModalEvents() {
        const closeButton = document.getElementById("closeRouteModal");
        const modal = document.getElementById("routeModal");

        closeButton?.addEventListener("click", closeRouteModal);

        modal?.addEventListener("click", (event) => {
            if (event.target === modal) closeRouteModal();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeRouteModal();
        });
    }

    /**
     * Cuenta cuántas rutas tienen ciudades peruanas válidas (igual que renderRoutes).
     * Usar para el contador "Trabajos activos" en el stats strip.
     */
    function countActiveMapRoutes(routes) {
        const rawRoutes = Array.isArray(routes) ? routes : [];
        const peruRoutes = rawRoutes.filter(route => {
            const originPos = getCityPosition(route.origin, route.originId);
            const destinationPos = getCityPosition(route.destination, route.destinationId);
            return Boolean(originPos && destinationPos);
        });
        // Si no hay rutas peruanas, el mapa usa todas (rawRoutes fallback)
        return peruRoutes.length > 0 ? peruRoutes.length : rawRoutes.length;
    }

    // ============================================
    // EXPORTS
    // ============================================

    return {
        LAST_ROUTE_WINDOW_HOURS,
        getLatestOpenRoutePerDriverInLastHours,
        buildRouteTrips,
        getAssignedRouteByDriver,
        countActiveMapRoutes,
        renderRoutes,
        setupModalEvents
    };
})(window.AppUtils);
