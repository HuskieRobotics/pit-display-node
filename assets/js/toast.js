/**
 * Toast notification system for the application
 * Provides simple toast notifications with progress bar support
 */

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Create toast container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      document.body.appendChild(this.container);

      // Add styles if not already present
      if (!document.getElementById("toast-styles")) {
        const style = document.createElement("style");
        style.id = "toast-styles";
        style.textContent = `
          .toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
          }
          .toast {
            background-color: #333;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            margin-top: 10px;
            min-width: 250px;
            max-width: 350px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            animation: slideIn 0.3s ease-in-out;
          }
          .toast-title {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .toast-message {
            margin-bottom: 10px;
          }
          .toast-progress-container {
            width: 100%;
            height: 5px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            margin-top: 5px;
          }
          .toast-progress-bar {
            height: 100%;
            background-color: #4CAF50;
            border-radius: 2px;
            width: 0%;
            transition: width 0.3s ease;
          }
          .toast-close {
            position: absolute;
            top: 5px;
            right: 10px;
            cursor: pointer;
            font-size: 16px;
            opacity: 0.7;
          }
          .toast-close:hover {
            opacity: 1;
          }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
          .toast.closing {
            animation: slideOut 0.3s ease-in-out forwards;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }

  /**
   * Show a toast notification
   * @param {Object} options - Toast options
   * @param {string} options.title - Toast title
   * @param {string} options.message - Toast message
   * @param {number} options.duration - Duration in ms (0 for persistent)
   * @param {boolean} options.showProgress - Whether to show a progress bar
   * @returns {Object} - Toast control object with update and close methods
   */
  show(options = {}) {
    const {
      title = "",
      message = "",
      duration = 5000,
      showProgress = false,
    } = options;

    // Create toast element
    const toast = document.createElement("div");
    toast.className = "toast";

    // Add close button
    const closeBtn = document.createElement("span");
    closeBtn.className = "toast-close";
    closeBtn.innerHTML = "&times;";
    toast.appendChild(closeBtn);

    // Add title if provided
    if (title) {
      const titleEl = document.createElement("div");
      titleEl.className = "toast-title";
      titleEl.textContent = title;
      toast.appendChild(titleEl);
    }

    // Add message
    const messageEl = document.createElement("div");
    messageEl.className = "toast-message";
    messageEl.textContent = message;
    toast.appendChild(messageEl);

    // Add progress bar if requested
    let progressContainer, progressBar;
    if (showProgress) {
      progressContainer = document.createElement("div");
      progressContainer.className = "toast-progress-container";

      progressBar = document.createElement("div");
      progressBar.className = "toast-progress-bar";
      progressBar.style.width = "0%";

      progressContainer.appendChild(progressBar);
      toast.appendChild(progressContainer);
    }

    // Add to container
    this.container.appendChild(toast);

    // Set up auto-close timer
    let timer;
    if (duration > 0) {
      timer = setTimeout(() => {
        this.closeToast(toast);
      }, duration);
    }

    // Set up close button handler
    closeBtn.addEventListener("click", () => {
      if (timer) clearTimeout(timer);
      this.closeToast(toast);
    });

    // Return control object
    return {
      // Update toast content
      update: (newOptions = {}) => {
        if (newOptions.title !== undefined && title) {
          toast.querySelector(".toast-title").textContent = newOptions.title;
        }
        if (newOptions.message !== undefined) {
          toast.querySelector(".toast-message").textContent =
            newOptions.message;
        }
        if (newOptions.progress !== undefined && progressBar) {
          progressBar.style.width = `${newOptions.progress}%`;
        }
        // Reset timer if duration provided
        if (newOptions.duration !== undefined && timer) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            this.closeToast(toast);
          }, newOptions.duration);
        }
      },
      // Close the toast
      close: () => {
        if (timer) clearTimeout(timer);
        this.closeToast(toast);
      },
    };
  }

  /**
   * Close a toast with animation
   * @param {HTMLElement} toast - Toast element to close
   */
  closeToast(toast) {
    toast.classList.add("closing");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300); // Match animation duration
  }
}

// Create a singleton instance
const toastManager = new ToastManager();

// Export the toast manager
window.toastManager = toastManager;
