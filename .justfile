EXTENSION := `cat metadata.json | jq -r '.uuid'`
NAME      := `cat metadata.json | jq -r '.uuid' | cut -d'@' -f1`

default:
    @just --list

build:
    @pnpm install

compile:
    @tsc || true

gresource:
    #!/bin/bash
    if [[ -f data/{{ NAME }}.gresource.xml ]]; then
        rm -rf data/{{ NAME }}.gresource.xml
    fi
    cat <<EOF > data/{{ NAME }}.gresource.xml
    <?xml version="1.0" encoding="UTF-8"?>
    <gresources>
        <gresource prefix="/org/gnome/shell/extensions/{{ NAME }}">
    EOF
    for file in $(find ./assets/icons/ -type f); do
        filename=$(basename $file)
        filename="${filename%.*}"
        echo "        <file compressed=\"true\" preprocess=\"xml-stripblanks\" alias=\"icons/scalable/categories/{{ NAME }}-${filename}\">icons/${filename}.svg</file>" >> data/{{ NAME }}.gresource.xml
    done
    cat <<EOF >> data/{{ NAME }}.gresource.xml
        </gresource>
    </gresources>
    EOF

schemas:
    @glib-compile-schemas schemas
    @glib-compile-resources --sourcedir ./assets/ --target data/{{ NAME }}.gresource data/{{ NAME }}.gresource.xml


make:
    @just clean build compile gresource schemas
    @cp -r data dist/
    @cp -r schemas dist/
    @cp stylesheet.css dist/
    @cp metadata.json dist/

install:
    @just make
    @rm -rf ~/.local/share/gnome-shell/extensions/{{ EXTENSION }}
    @mkdir -p ~/.local/share/gnome-shell/extensions/{{ EXTENSION }}
    @cp -r dist/* ~/.local/share/gnome-shell/extensions/{{ EXTENSION }}

clean:
    @rm -rf dist
    @mkdir dist

zip:
    @rm -f ../../{{ EXTENSION }}.zip
    @just make
    @(cd dist && zip -9r ../../{{ EXTENSION }}.zip .)

