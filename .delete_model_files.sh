#!/bin/bash
set -e
rm -f src/app/models/user.ts \
  src/app/models/app-notification.ts \
  src/app/models/breadcrumb.ts \
  src/app/models/page-event.ts \
  src/app/models/faq-item.ts \
  src/app/models/feedback-entry.ts \
  src/app/models/support-ticket.ts \
  src/app/models/ticket-message.ts

echo "Deleted old model files"
