(() => {
  "use strict";
  const data = window.SCHOOL_DATA;
  if (!data) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const icon = (name) =>
    `<img class="icon" src="assets/icons/${name}.svg" alt="" aria-hidden="true" width="20" height="20">`;
  const normalize = (value) =>
    String(value)
      .toLocaleLowerCase("id")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const menuButton = $(".menu-button");
  const mobileNav = $("#mobile-nav");
  const setMenu = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Tutup navigasi" : "Buka navigasi",
    );
    $("img", menuButton).src = `assets/icons/${open ? "x" : "list"}.svg`;
    mobileNav.hidden = !open;
    mobileNav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };
  menuButton.addEventListener("click", () =>
    setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
  );
  $$("a", mobileNav).forEach((link) =>
    link.addEventListener("click", () => setMenu(false)),
  );
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      menuButton.focus();
    }
  });
  window
    .matchMedia("(min-width: 1024px)")
    .addEventListener("change", (event) => {
      if (event.matches) setMenu(false);
    });

  const dialog = $("#site-dialog");
  let dialogTrigger;
  const openDialog = (title, content) => {
    dialogTrigger = document.activeElement;
    $("#dialog-title").textContent = title;
    $(".dialog-body", dialog).innerHTML = content;
    dialog.showModal();
    $(".dialog-close", dialog).focus();
  };
  $(".dialog-close", dialog).addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    $(".dialog-body", dialog).replaceChildren();
    dialogTrigger?.focus();
  });
  document.addEventListener("click", (event) => {
    const imageButton = event.target.closest("[data-image]");
    if (imageButton)
      openDialog(
        imageButton.dataset.title,
        `<img src="${escape(imageButton.dataset.image)}" alt="${escape(imageButton.dataset.title)}">`,
      );
    const activity = event.target.closest("[data-activity]");
    if (activity)
      openDialog(
        activity.dataset.activity,
        `<p>${escape(activity.dataset.description)}</p><p><strong>Pembimbing:</strong> ${escape(activity.dataset.mentor)}</p>`,
      );
    const profileButton = event.target.closest("[data-profile]");
    if (profileButton) {
      const alumni = data.alumni.find(
        (item) => item.id === Number(profileButton.dataset.profile),
      );
      if (!alumni) return;
      const details = [
        ["Tahun lulus", alumni.year],
        ["Perguruan tinggi", alumni.university],
        ["Jurusan", alumni.program],
        ["Kota", alumni.city],
        ["Jalur masuk", alumni.route],
      ];
      openDialog(
        alumni.name,
        `<dl class="profile-details">${details.map(([label, value]) => `<div><dt>${label}</dt><dd>${escape(value || "Belum tersedia")}</dd></div>`).join("")}</dl>`,
      );
    }
  });

  $$("[role=tablist]").forEach((tablist) => {
    const tabs = $$('[role="tab"]', tablist);
    const activate = (selected) =>
      tabs.forEach((tab) => {
        const active = tab === selected;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        document.getElementById(tab.getAttribute("aria-controls")).hidden =
          !active;
      });
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (event) => {
        const direction =
          event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (!direction) return;
        event.preventDefault();
        const next = tabs[(index + direction + tabs.length) % tabs.length];
        activate(next);
        next.focus();
      });
    });
  });

  if ($("#teacher-search")) {
    let limit = 8;
    const search = $("#teacher-search");
    const render = () => {
      const query = normalize(search.value.trim());
      const teachers = data.teachers.filter((teacher) =>
        normalize(
          `${teacher.name} ${teacher.role} ${teacher.subject}`,
        ).includes(query),
      );
      $("#teacher-count").textContent =
        `${teachers.length} tenaga pendidik${teachers.length > limit ? ` · ${limit} ditampilkan` : ""}`;
      $("#teacher-results").innerHTML = teachers.length
        ? teachers
            .slice(0, limit)
            .map(
              (teacher) =>
                `<article class="teacher-card"><div class="teacher-photo" role="img" aria-label="Foto ${escape(teacher.name)} dikosongkan sesuai ketentuan tugas"></div><h3>${escape(teacher.name)}</h3>${teacher.role ? `<p class="teacher-role">${escape(teacher.role)}</p>` : ""}<p>${escape(teacher.subject === "-" ? "Informasi mata pelajaran belum tersedia" : teacher.subject)}</p></article>`,
            )
            .join("")
        : `<p>Tidak ada guru yang cocok dengan pencarian.</p>`;
      $("#teacher-more").hidden = limit >= teachers.length;
    };
    search.addEventListener("input", () => {
      limit = 8;
      render();
    });
    $("#teacher-more").addEventListener("click", () => {
      limit += 8;
      render();
    });
    render();
  }

  const paginate = (root, current, total, change) => {
    root.replaceChildren();
    if (total <= 1) return;
    const pages = [...new Set([1, current - 1, current, current + 1, total])]
      .filter((page) => page > 0 && page <= total)
      .sort((a, b) => a - b);
    pages.forEach((page, index) => {
      if (index && page - pages[index - 1] > 1) root.append("…");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "page-button";
      button.textContent = page;
      button.setAttribute("aria-label", `Halaman ${page}`);
      if (page === current) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => change(page));
      root.append(button);
    });
  };
  if ($("#alumni-search")) {
    const search = $("#alumni-search"),
      year = $("#alumni-year"),
      university = $("#alumni-university");
    let page = 1;
    [...new Set(data.alumni.map((item) => item.university))]
      .sort((a, b) => a.localeCompare(b, "id"))
      .forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        university.append(option);
      });
    const render = () => {
      const query = normalize(search.value.trim());
      const alumni = data.alumni.filter(
        (item) =>
          (!year.value || String(item.year) === year.value) &&
          (!university.value || item.university === university.value) &&
          normalize(item.name).includes(query),
      );
      const pages = Math.ceil(alumni.length / 10);
      page = Math.min(Math.max(page, 1), pages || 1);
      $("#alumni-count").textContent =
        `${alumni.length} profil alumni${alumni.length ? ` · halaman ${page} dari ${pages}` : ""}`;
      $("#alumni-results").innerHTML = alumni.length
        ? alumni
            .slice((page - 1) * 10, page * 10)
            .map(
              (item) =>
                `<tr><td><button type="button" data-profile="${item.id}">${escape(item.name)}</button></td><td>${item.year}</td><td>${escape(item.university)}</td><td>${escape(item.program)}</td></tr>`,
            )
            .join("")
        : `<tr><td colspan="4">Data alumni tidak ditemukan.</td></tr>`;
      paginate($("#alumni-pagination"), page, pages, (next) => {
        page = next;
        render();
        $("#data-alumni").scrollIntoView({ behavior: "smooth" });
      });
    };
    [search, year, university].forEach((control) =>
      control.addEventListener(control === search ? "input" : "change", () => {
        page = 1;
        render();
      }),
    );
    $("#alumni-reset").addEventListener("click", () => {
      search.value = "";
      year.value = "";
      university.value = "";
      page = 1;
      render();
      search.focus();
    });
    render();
  }

  if ($("#contact-form"))
    $("#contact-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const values = Object.fromEntries(new FormData(form));
      $(".form-status", form).textContent =
        "Aplikasi email sedang dibuka. Pesan belum terkirim sampai email dikirim.";
      location.href = `mailto:smaitalkahfi@gmail.com?subject=${encodeURIComponent(`Pesan website dari ${values.name}`)}&body=${encodeURIComponent(`Nama: ${values.name}\nEmail: ${values.email}\n\n${values.message}`)}`;
    });
  if ($("#alumni-story-form"))
    $("#alumni-story-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const values = Object.fromEntries(new FormData(form));
      const preview = `Nama: ${values.name}\nEmail: ${values.email}\nTahun lulus: ${values.year || "-"}\nPerguruan tinggi atau profesi: ${values.activity || "-"}\n\n${values.story}`;
      openDialog(
        "Tinjau cerita alumni",
        `<p>Cerita belum dikirim. Lanjutkan melalui formulir resmi sekolah.</p><pre class="story-preview">${escape(preview)}</pre><p><a class="button" href="https://smaitalkahfi.sch.id/alumni/berbagi-cerita/" target="_blank" rel="noopener noreferrer">Buka formulir resmi${icon("arrow-up-right")}</a></p>`,
      );
      $(".form-status", form).textContent =
        "Cerita siap ditinjau. Gunakan formulir resmi untuk mengirim.";
    });

  if (
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    "IntersectionObserver" in window
  ) {
    document.documentElement.classList.add("js");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("pending");
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    $$(".reveal").forEach((element) => {
      if (element.getBoundingClientRect().top > innerHeight) {
        element.classList.add("pending");
        observer.observe(element);
      }
    });
  }
})();
